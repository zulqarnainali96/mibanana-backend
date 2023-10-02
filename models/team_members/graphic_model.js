const mongoose = require("mongoose")

const designerProjects = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    designer_project_list: [{
        type: Object,
        required: true
    }]

})
const graphicDesignerProjects = mongoose.model('designer_projects',designerProjects)

module.exports = graphicDesignerProjects