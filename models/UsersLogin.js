const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    roles : [{
        type : String,
        required : true,
        default : ["Customer"]
    }],
    is_active : {
        type : Boolean,
        required : true,
        default : true
    },
    verified : {
        type : Boolean,
        default : false
    },
    created_at : {
        type : String,
        required : false
    }  
})
const User = mongoose.model('User',UserSchema)
module.exports = User