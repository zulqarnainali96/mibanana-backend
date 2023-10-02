const asyncHandler = require("express-async-handler")
const { ProfileDetails: profileModal } = require("../models/profile-settings")


const fileUploader = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(204).send("Image file not found")
    }
    const { email, phone, fullName, user } = req.body
    // console.log(req.file)

    if (!email, !phone, !fullName, !user) {
        return res.status(422).send({ message: "invalid data missing required fields" })
    }
    let avatar = req.file.path
    // cloudinary.uploader.upload_stream((result) => {
    //     // res.status(201).json({ user_avatar_url: result.secure_url });
    //     // console.log("avatar ",result)
    //     // avatar = result.secure_url
    // }).end(req.file.buffer);

    const checkField = await profileModal.findOne({ user }).exec()
    if (checkField === null ) {
        const creatingProfile = await profileModal.create({ email, user, phone, fullName, avatar })
        if (typeof creatingProfile !== null) {
            return res.status(200).send({ message: 'profile created', profile: creatingProfile })
        }
    }
    else {
        checkField.user = user
        checkField.fullName = fullName,
            checkField.email = email,
            checkField.phone = phone,
            checkField.avatar = avatar?.length ? avatar : ''

        const data = await checkField.save()
        return res.status(200).send({ message: 'Profile Data saved', profile: data })
    }
    return res.status(500).send('Server error')
})

const getProfileData = asyncHandler(async (req, res) => {
    const user = req.params.id
    if (!user) {
        return res.status(400).json({ message: "Invalid UserID Please Login again" })
    }
    if (user) {
        const data = await profileModal.findOne({ user }).lean().exec()
        if (data === null) {
            return res.status(404).json({ message: "No Data Found" })
        } else {
            return res.status(200).json({ profile: data })
        }
    }
    return res.status(404).json({ message: "Failed to found Data" })
})


module.exports = { getProfileData, fileUploader };