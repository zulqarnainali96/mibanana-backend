const mongoose = require("mongoose")

const projectModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name : {
        type : String,
        required : true,
    },
    project_category: {
        type: String,
        required: true
    },
    design_type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    project_title: {
        type: String,
        required: true
    },
    project_description: {
        type: String,
        required: true
    },
    describe_audience: {
        type: String,
        required: true
    },
    sizes: {
        type: String,
        required: true
    },
    resources: {                    // Content of Project
        type: String,
        required: true
    },
    reference_example: [{
        type: String,
        required: false
    }],
    add_files: [{
        type: String,
        required: false
    }],
    specific_software_names: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        default: false,
        required: true
    },
    status : {
        type : String,
        required : true,
        default : 'Approval'
    },


    // Required in Future when project manager update the data it will need a need to add Array of Team members that are working on this project

    team_members: [{
        type: Object,
        required: false
    }],
    status: {
        type: String,
        required: false
    }
    ////// END
},
    {
        timestamps: true
    }
)

module.exports = Graphicproject = mongoose.model('graphicDesign', projectModel)




