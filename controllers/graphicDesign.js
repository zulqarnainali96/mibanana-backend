const asyncHandler = require("express-async-handler")
const User = require('../models/UsersLogin')
const graphicDesignModel = require("../models/graphic-design-model")
const { bucket } = require('../google-cloud-storage/gCloudStorage')
const Projects = require('../models/graphic-design-model')
const { v4: uniqID } = require('uuid')
const path = require('path')
// const graphicDesignerProjects = require("../models/team_members/graphic_model")

const createGraphicDesign = asyncHandler(async (req, res) => {
    const {
        id, // requried User ID
        name,
        project_category,  // requried
        design_type, brand, // requried 
        project_title, // requried
        project_description, // requried
        sizes, // requried
        is_active,
        specific_software_names,

        // add_files,
        // describe_audience, // requried
        // reference_example,
        // resources,
    } = req.body

    if (!id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    if (id) {
        const findUser = await User.findOne({ _id: id }).select('-password').lean().exec()
        if (!findUser) {
            throw new Error("User not found ")
            // return res.status(404).json({ message: 'User not found' })
        }
        if (findUser) {
            const obj = {
                user: id, // ID of Customer
                name,  // Name of person who creating project // Customer

                project_category,
                design_type,
                brand,
                project_title,
                project_description,
                sizes,
                specific_software_names,
                is_active,

                status: 'Approval',

                // resources,
                // reference_example,
                // describe_audience,
                // add_files,
            }
            const creating_data = await graphicDesignModel.create(obj)
            if (!creating_data) {
                throw new Error("Unable to create data")
            }
            return res.status(201).json({ message: 'Graphic Project Created', project: creating_data })

        }
        return res.status(404).send({ message: 'User not found' })
    }
    return res.status(400).json({ message: "failed to create data " })
})


const upadteProject = asyncHandler(async (req, res) => {
    const { project_id, project_data } = req.body
    if (!project_id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    // console.log('project data', project_data)
    const { team_members, is_active, status } = project_data
    // console.log(' => ', team_members, is_active, status)

    if (project_id) {
        const findingProj = await graphicDesignModel.findById(project_id)
        console.log(findingProj)
        if (findingProj) {
            if (findingProj.team_members.lenght) {
                console.log('IF BLOCK')
                findingProj.team_members = [...findingProj.team_members, ...team_members]
            } else {
                console.log(findingProj.team_members)
                findingProj.team_members = team_members
                console.log('ELSE BLOCK')
            }
            findingProj.status = status
            findingProj.is_active = is_active
            const save = await findingProj.save()
            return res.status(201).send({ message: 'Project Updated', save })
        }
    }
    res.status(404).send({ message: "No Project Found" })
})

const deleteGraphicProject = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).json({ message: "Project not provided Try Login again" })
    }
    try {
        const findProject = await graphicDesignModel.findById(_id)
        if (findProject) {
            let { name, user, _id, project_title } = findProject
            name = name.replace(/\s/g, '')
            project_title = project_title.replace(/\s/g, '')

            const prefix = `${name}-${user}/${project_title}-${_id}/`
            const designer_prefix = `${name}-${user}/${project_title}-${_id}/designer_upload/`

            const [files] = await bucket.getFiles({ prefix })
            const [desingerFiles] = await bucket.getFiles({ prefix: designer_prefix })

            await Promise.all(
                files?.map(async (file) => {
                    try {
                        await file.delete();
                        console.log(`Deleted file: ${file.name}`);
                    } catch (error) {
                        throw error
                    }
                })
            ).then(async () => {
                if (desingerFiles.length > 0) {
                    await Promise.all(
                        desingerFiles?.map(async (file) => {
                            try {
                                await file.delete();
                                // console.log(`Deleted file: ${file.name}`);
                            } catch (error) {
                                throw error
                            }
                        })
                    ).then(async () => {
                        await graphicDesignModel.findByIdAndRemove(_id)
                        return res.status(200).send({ message: 'Project Deleted' })
                    }).catch(err => { throw err })
                } else {
                    await graphicDesignModel.findByIdAndRemove(_id)
                    return res.status(200).send({ message: 'Project Deleted' })
                }
            }).catch((err) => { throw err })

        } else {
            res.status(400).send({ message: 'Project not found' })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }


}

const getGraphicProject = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    if (id) {
        const findUser = await User.findOne({ _id: id }).exec()
        if (findUser) {
            const Roles = findUser.roles
            if (Roles.includes("Project-Manager")) {
                const CustomerProjects = await graphicDesignModel.find().lean()
                return res.status(200).send({
                    message: 'hello Project manager', CustomerProjects
                })
            }
            else if (Roles.includes("Customer")) {
                const CustomerProjects = await graphicDesignModel.find({ user: id }).exec()
                if (CustomerProjects) {
                    return res.status(200).send({
                        message: 'hello customer',
                        CustomerProjects
                    })
                }
            }
            else if (Roles.includes("Graphic-Designer")) {
                const getList = await graphicDesignModel.find().lean().exec()
                if (getList) {
                    // console.log(id)
                    const filteredData = getList.filter(item =>
                        item.team_members.some(member => member._id === id)
                    );
                    // console.log(filteredData);
                    return res.status(200).send({
                        message: 'hello designer', CustomerProjects: filteredData
                    })
                }
            }
        }
    }
    return res.status(404).send('Data not available')

})

const getCustomerFiles = async (req, res) => {
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
            const prefix = `${name}-${user}/${project_title}-${_id}/`
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
        // console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }
}


module.exports = { createGraphicDesign, getGraphicProject, upadteProject, deleteGraphicProject, getCustomerFiles }


// [
//     {
//       _id: new ObjectId("6518020ab029630971206a6b"),
//       user: new ObjectId("64fe366943475b69f1b73bf5"),
//       name: 'Testing',
//       project_category: 'Graphic Design',
//       design_type: 'App',
//       brand: 'Ideas',
//       project_title: 'New One',
//       project_description: 'Project Desc',
//       describe_audience: 'Describle Audience',
//       sizes: '1080 x 1080',
//       resources: 'My Content',
//       reference_example: null,
//       add_files: [],
//       specific_software_names: 'Adobe Photoshop',
//       is_active: true,
//       status: 'Ongoing',
//       team_members: [ {
//         id : 222 ,
//         name : 'zain'
//       } ],
//     },
//     {
//       _id: new ObjectId("6518365ab029630971206b8b"),
//       user: new ObjectId("64fe366943475b69f1b73bf5"),
//       name: 'Testing',
//       project_category: 'Illustrations',
//       design_type: 'App',
//       brand: 'Nike',
//       project_title: 'Zain hashmi',
//       project_description: 'zxcz',
//       describe_audience: 'sd',
//       sizes: '1080 x 1080',
//       resources: 'weq',
//       reference_example: null,
//       add_files: [],
//       specific_software_names: 'Adobe Photoshop',
//       is_active: true,
//       status: 'Ongoing',
//       team_members: [ {
//         id : 223 ,
//         name : 'zain'
//       } ],
//     }
//   ]