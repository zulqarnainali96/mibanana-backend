const User = require('../models/UsersLogin')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const createUsers = asyncHandler(async (req, res) => {
    const { email, password, name, roles, } = req.body
    if (!email || !password || !roles) {
        return res.status(400).json({
            message: 'All fields are required (email, password, roles)'
        })
    }
    const duplicate = await User.findOne({ email }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'email already exists' })
    }
    const hashPassword = await bcrypt.hash(password, 10) // Salt Rounds
    const created_at = new Date().toDateString() + " " + new Date().toLocaleTimeString()
    const userObject = { email, 'password': hashPassword, name, created_at, is_active: true, roles }
    const user = await User.create(userObject)

    if (user) {
        return res.status(200).json({ message: 'User Created Successfully ' + email })
    } else {
        return res.status(400).json({ message: 'Invalid user data' })
    }

})

const LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: 'All fields are required (email and password)'
        })
    }
    const findUser = await User.findOne({ email }).exec()
    if (findUser) {
        const hashPassword = await bcrypt.compareSync(password, findUser?.password) //salt rounds
        if (hashPassword) {
            const { name, email, _id, is_active, created_at, roles } = findUser
            return res.status(200).json({
                message: 'Login Succesfully', userDetails: {
                    name, email, roles, id: _id, is_active, created_at
                }
            })
        } else {
            return res.status(400).json({ message: 'Invalid password' })
        }
    }
    return res.status(404).json({ message: 'User not found' })
})

module.exports = { createUsers, LoginUser }