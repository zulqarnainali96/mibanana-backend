const mongoose = require("mongoose")

const companyProfile = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    company_name: {
        type: String,
        required: false,
    },
    contact_person: {
        type: String,
        required: false,
    },
    company_size: {
        type: String,
        required: false,
    },
    primary_email: {
        type: String,
        required: false,
    },
    primary_phone: {
        type: String,
        required: false,
    },
    time_zone: {
        type: String,
        required: false,
    },
    company_address: {
        type: String,
        required: false,
    },
}, {
    timestamps: true
})

const CompanyDetaitls = mongoose.model('company_details', companyProfile)

const profile = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false,
    }
},
    {
        timestamps: true
    }
)

const ProfileDetails = mongoose.model('Profile', profile)

module.exports = { CompanyDetaitls, ProfileDetails }
