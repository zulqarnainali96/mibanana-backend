const mongoose = require('mongoose')


const brandModel = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    brand_name: {
        type: String,
        required: true,

    },
    brand_description: {
        type: String,
        required: true,

    },
    web_url: {
        type: String,
        required: false,

    },
    facebook_url: {
        type: String,
        required: false,

    },
    instagram_url: {
        type: String,
        required: false,

    },
    twitter_url: {
        type: String,
        required: false,
    },
    linkedin_url: {
        type: String,
        required: false,

    },
    tiktok_url: {
        type: String,
        required: false,

    }
})

module.exports = mongoose.model('brand_model',brandModel)