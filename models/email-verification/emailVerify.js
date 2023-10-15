const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique : true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now, expires: 3600 },
})

module.exports = mongoose.model('token', tokenSchema)