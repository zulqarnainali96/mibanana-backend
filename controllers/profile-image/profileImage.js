const { bucket } = require('../../google-cloud-storage/gCloudStorage')
const User = require('../../models/UsersLogin')
const { v4: uniqID } = require('uuid')
const path = require('path')


const UploadProfileImage = async (req, res) => {

    const id = req.params.id
    const { fullname, email, phone_no } = req.body

    if (!id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    if (!email) {
        return res.status(402).json({ message: "email is required" })
    }
    // if (req.file) {
    //     console.log(req.file)
    // }
    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).send({ message: 'User not Found try login again' })

        user.name = fullname
        user.email = email
        user.phone_no = phone_no
        let name = user.name.replace(/\s/g,'')
        const prefix = `${name}-${user._id}/profile-image/`
        const blob = bucket.file(prefix + req.file.originalname)
        blob.createWriteStream({ resumable: false }).on('finish', async () => {
            console.log('file uploaded')
            const [file] = await bucket.getFiles({ prefix })
            if (file.length > 0) {
                let filesInfo = file?.map((file) => {
                    let obj = {}
                    obj.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name)
                    return obj
                })
                if (filesInfo.length > 0) {

                    const [profile] = filesInfo
                    console.log(profile.url)
                    user.avatar = profile.url
                    const profileData = await user.save()

                    if (profileData) {
                        return res.status(201).send({
                            message: 'Profile Updated', profileData: {
                                fullname : profileData.name,
                                email : profileData.email,
                                phone : profileData.phone_no,
                                avatar : profileData.avatar,
                            }
                        })
                    } else {
                        return res.status(400).send({ message: 'Found error try again!' })
                    }

                }
            } else {
                throw new Error('Found error try again')
            }
        }).on('error', (err) => {
            console.log(err)
            throw err
        }).end(req.file.buffer)

    } catch (error) {
        res.status(500).send({ message: 'Internal Server error' })
    }
}

const UploadWithoutProfileImage = async (req, res) => {
    const id = req.params.id
    const { fullname, email, phone_no } = req.body

    if (!id) {
        return res.status(400).json({ message: "id not provided Try Login again" })
    }
    if (!email) {
        return res.status(402).json({ message: "email is required" })
    }
    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).send({ message: 'User not Found try login again' })

        user.name = fullname
        user.email = email
        user.phone_no = phone_no
        const profileData = await user.save()
        if (profileData) {
            return res.status(201).send({
                message: 'Profile Updated', profileData
            })
        }  else {
            return res.status(400).send({ message: 'Found error try again!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal Server error' })
    }
}

module.exports = { UploadProfileImage, UploadWithoutProfileImage }