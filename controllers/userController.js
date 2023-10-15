const User = require('../models/UsersLogin')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const Token = require('../models/email-verification/emailVerify')
const sendEmail = require('../utils/sendEmail')
const Joi = require('joi')

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
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save()
        const url = `${process.env.FRONT_BASE_URL}/auth/user/${user._id}/verify/${token.token}`
        await sendEmail(user.email, "Verify Email", url)

        return res.status(200).json({ message: 'An Email Send to your account please verify ' + email })
        // return res.status(200).json({ message: 'User Created Successfully ' + email })
    } else {
        return res.status(400).json({ message: 'Invalid user data' })
    }
})

const LoginUser = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ message: "Invalid Email not found" });
        }
        const validPassword = await bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }
        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                const url = `${process.env.FRONT_BASE_URL}/auth/user/${user._id}/verify/${token.token}`
                await sendEmail(user.email, "Verify Email", url);
            }
            return res.status(400).send({ message: "An Email sent to your account please verify" });
        }
        const { name, email, _id, is_active, created_at, roles, verified } = user
        // const token = user.generateAuthToken();
        res.status(200).json({ userDetails: { name, email, id: _id, is_active, created_at, roles, verified }, message: "logged in successfully" });

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("email"),
        password: Joi.string().required().label("password"),
    });
    return schema.validate(data);
};


// const LoginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body
//     if (!email || !password) {
//         return res.status(400).json({
//             message: 'All fields are required (email and password)'
//         })
//     }
//     const findUser = await User.findOne({ email }).exec()
//     if (!findUser.verified) {
//         let token = await Token.findOne({ userId: findUser.id })
//         if (!token) {
//             token = await new Token({
//                 userId: findUser._id,
//                 token: crypto.randomBytes(32).toString('hex')
//             }).save()
//         }
//         return res.status(400).send({ message: 'An Email send to your account please verify' })
//     }

//     const hashPassword = await bcrypt.compareSync(password, findUser?.password) //salt rounds
//     if (hashPassword) {
//         const { name, email, _id, is_active, created_at, roles } = findUser
//         return res.status(200).json({
//             message: 'Login Succesfully', userDetails: {
//                 name, email, roles, id: _id, is_active, created_at
//             }
//         })
//     }
//     else {
//         return res.status(400).json({ message: 'Invalid password' })
//     }
//     // return res.status(404).json({ message: 'User not found' })
// })

module.exports = { createUsers, LoginUser }