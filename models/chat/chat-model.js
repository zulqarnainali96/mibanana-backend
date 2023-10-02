const mongoose = require("mongoose")

const project_chat = mongoose.Schema({
    project_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'graphicDesign',
    },
    chat_msg : [
        {
            type : Object,
            required : true,
            default : []
        }
    ]
})
const chatModel = mongoose.model('project_chat_data',project_chat)
module.exports = chatModel