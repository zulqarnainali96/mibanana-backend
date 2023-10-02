const asyncHandler = require("express-async-handler")
const User = require('../models/UsersLogin')
const graphicDesignModel = require("../models/graphic-design-model")
const graphicDesignerProjects = require("../models/team_members/graphic_model")

const createGraphicDesign = asyncHandler(async (req, res) => {
    console.log(req.body)
    const {
        id, // requried User ID
        name,
        project_category,  // requried
        design_type, brand, // requried 
        project_title, // requried
        project_description, // requried
        describe_audience, // requried
        sizes, // requried
        resources,
        is_active,
        reference_example,
        add_files,
        specific_software_names,
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
                user: id,
                project_category,
                design_type,
                brand,
                project_title,
                name,
                project_description,
                describe_audience,
                sizes,
                resources,
                reference_example,
                status: 'Approval',
                add_files,
                is_active,
                specific_software_names,
            }
            const creating_data = await graphicDesignModel.create(obj)
            if (!creating_data) {
                throw new Error("Unable to create data")
            }
            return res.status(201).json({ message: 'Graphic Project Created' })

        }
    }
    return res.status(400).json({ message: "failed to create data " })
})


const upadteProject = asyncHandler(async (req, res) => {
    const { project_id, project_data } = req.body
    if (!project_id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    console.log('project data', project_data)
    const { team_members, is_active, status } = project_data
    console.log(' => ', team_members, is_active, status)

    if (project_id) {
        const findingProj = await graphicDesignModel.findById(project_id).exec()
        if (findingProj) {
            findingProj.team_members = team_members
            findingProj.status = status
            findingProj.is_active = is_active
            const save = await findingProj.save()
            return res.status(201).send({ message: 'Project Updated', save })
        }
    }
    res.status(404).send({ message: "not found 404" })
})


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
                    console.log(id)
                    const filteredData = getList.filter(item =>
                        item.team_members.some(member => member._id === id)
                    );
                    console.log(filteredData);
                    return res.status(200).send({
                        message: 'hello designer', CustomerProjects: filteredData
                    })
                }
            }
        }
    }
    return res.status(404).send('Data not available')

})

module.exports = { createGraphicDesign, getGraphicProject, upadteProject }


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