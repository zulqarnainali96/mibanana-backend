const User = require('../models/UsersLogin')
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")


const changePassword = asyncHandler(async (req, res) => {
    const { id, password, new_password } = req.body
    if (!id) {
        return res.status(400).send({ message: "Invalid ID Please provide ID" })
    }
    if (id && password) {
        const user = await User.findById(id).exec()
        if (user) {
            const checkUser = await bcrypt.compare(password, user.password)
            if (checkUser) {
                user.password = await bcrypt.hash(new_password, 10) // Salt Rounds
                user.created_at = new Date().toDateString() + " " + new Date().toLocaleTimeString()
                const save = await user.save()
                if (save) return res.status(201).send({ message: "Password Changed" })
            }
            else {
                return res.status(400).send({ message: "Unable to change password not matched" })
            }
        } else {
            return res.status(400).send({ message: "Unable to change password not matched" })
        }
    }
    res.send({ message: "Please provide required field" })
})


module.exports = changePassword