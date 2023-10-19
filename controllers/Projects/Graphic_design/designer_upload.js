const User = require('../../../models/UsersLogin')
const Projects = require('../../../models/graphic-design-model')
const { bucket } = require('../../../google-cloud-storage/gCloudStorage')
const { v4: uniqID } = require('uuid')
const path = require('path')


const designerUpload = async (req, res) => {
    const files = req.files
    const _id = req.params.id
    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    if (!files) {
        return res.status(400).send({ message: 'Files not found' })
    }
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            let { user, name, project_title } = currentProject
            project_title = project_title.replace(/\s/g, '')
            name = name.replace(/\s/g, '')
            const prefix = `${name}-${user}/${project_title}-${_id}/designer_uploads/`
            await Promise.all(files?.map(file => {

                const options = {
                    resumable: false,
                }
                const blob = bucket.file(prefix + file.originalname)
                blob.createWriteStream(options).on('error', (err) => { throw err }).on('finish',
                    async () => { }).end(file.buffer)
            }))
                .then(() => {
                    // console.log(currentProject)
                    res.status(201).send({ message: 'files uploaded' })

                })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}

const getDesignerFiles = async (req, res) => {
    const _id = req.params.id

    if (!_id) {
        return res.status(400).send({ message: 'ID not found' })
    }

    
    try {
        const currentProject = await Projects.findById(_id)
        if (currentProject) {
            let { user, name, project_title } = currentProject
            project_title = project_title.replace(/\s/g, '')
            name = name.replace(/\s/g, '')
            const prefix = `${name}-${user}/${project_title}-${_id}/designer_uploads/`
            const [files] = await bucket.getFiles({ prefix })
            let filesInfo = files?.map((file) => {
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
            // console.log(filesInfo)
            if (filesInfo.length > 0) {
                return res.status(200).send({ message: 'Files fount', filesInfo })
            }
            if (filesInfo.length === 0 && files.length === 0) {
                return res.status(404).send({ message: 'No Files Found' })
            }
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}

const deleteDesigners = async (req, res) => {
    const { user, project_id } = req.body
    // console.log(user, project_id)
    if (!project_id) {
        return res.status(400).send({ message: 'ID not found' })
    }
    try {
        const designers = await User.findById(user)
        if (designers) {
            const findProject = await Projects.findById(project_id)
            const filterTeamMembers = findProject?.team_members.filter(item => item._id !== user)
            findProject.team_members = filterTeamMembers
            findProject.save()
            return res.status(200).send({ message: "Team member removed" })
        } else {
            return res.status(404).send({ message: "Team member Not Found" })
        }
    } catch (err) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}

module.exports = { deleteDesigners, getDesignerFiles, designerUpload }


// module.exports = designerUpload



// const { add_files } = currentProject
//                 if (add_files.length > 0 && add_files.some( item => item.hasOwnProperty('version1'))  && !add_files.some( item => item.hasOwnProperty('designer_upload'))) {

//                     currentProject.add_files = [...add_files, { designer_upload: filesInfo }]
//                     await currentProject.save()
//                     return res.status(201).send({ message: 'Files Uploaded Successfully' })
//                 } else if (add_files.length > 0 && add_files.some( item => item.hasOwnProperty('version1')) && add_files.some( item => item.hasOwnProperty('designer_upload'))) {

//                     currentProject.add_files.designer_upload =  filesInfo
//                     await currentProject.save()
//                     return res.status(201).send({ message: 'Uploaded Successfully' })
//                 }