const { Storage } = require('@google-cloud/storage')
const path = require('path')
const uniqID = require('uuid').v4
const gCloudStorage = new Storage({
    projectId: 'mi-banana-401205',
    keyFilename: path.join(__dirname, 'mibanana.json'),

})
const graphicProjectsModel = require('../models/graphic-design-model')
const bucketName = `mi-banana-401205.appspot.com`
const bucket = gCloudStorage.bucket(bucketName)
const fs = require('fs')

const createFolder = async () => {
    const path = 'zain-12345610/brand/img.png'
    const [files] = await bucket.getFiles({ prefix: path })

    const blob = bucket.file(path)
    await blob.save('1.png', {
        metadata: {
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    })
    return { path }
}
let generationMatchPreCondition = 0

const uploadFile = async (req, res) => {
    let { user_id, name, project_id, project_title } = req.body
    project_title = project_title?.replace(/\s/g, '')
    const prefix = `${name}-${user_id}/${project_title}-${project_id}/`
    console.log('Uploading files...')
    await Promise.all(req.files.map(file => {
        const options = {
            resumable: false,
            preconditionOpts: {
                ifGenerationMatch: generationMatchPreCondition
            },
            // public : true
        }
        const blob = bucket.file(prefix + file.originalname)
        blob.createWriteStream(options).on('error', (err) => console.log('err=> ', err))
            .on('finish', async () => {
                // await bucket.file(file.originalname).makePublic()
            }).end(file.buffer)
    }))
        .then(() => {
            res.status(201).send({ message: 'files uploaded' })
        })
        .catch((err) => {
            res.status(500).send({ message: 'Internal Server error' })
            // console.log('resp =>', err)
        })
}

const getFiles = async (req, res) => {
    let { user_id, name, project_title, project_id } = req.body
    project_title = project_title?.replace(/\s/g, '')
    name = name?.replace(/\s/g, '')
    const prefix = `${name}-${user_id}/${project_title}-${project_id}/`
    try {
        const [files] = await bucket.getFiles({ prefix })
        let filesInfo = files.map((file) => {
            let obj = {}
            obj.id = uniqID(),
                obj.name = path.basename(file.name),
                obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                obj.download_link = file.metadata.mediaLink,
                obj.type = file.metadata.contentType,
                obj.size = file.metadata.size,
                obj.time = file.metadata.timeCreated,
                obj.upated_time = file.metadata.updated
            return obj
        })
        const findProject = await graphicProjectsModel.findById({ _id: project_id }).exec()

        if (findProject) {
            findProject.add_files = [{ version1: filesInfo }]
            findProject.save()
            // console.log(filesInfo)
            return res.status(201).send({ message: 'Project Created Successfully' })
        } else {
            return res.status(404).send({ message: 'Project not found' })
        }
    } catch (err) {
        return res.status(500).send({ message: 'Internal Server error' })
    }
}

const downloadFile = async (req, res) => {
    try {
        const [metaData] = await bucket.file(req.params.name).getMetadata()
        res.redirect(metaData.mediaLink)

    } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' })
        console.log(err)
    }
}

module.exports = { downloadFile, getFiles, uploadFile, bucket }
