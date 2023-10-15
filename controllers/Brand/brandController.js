const asyncHandler = require('express-async-handler')
const brand_model = require("../../models/Brands/brandModel")
const { bucket } = require("../../google-cloud-storage/gCloudStorage")
const User = require("../../models/UsersLogin")
const path = require('path')
const { v4: uniqID } = require('uuid')

const createBrand = async (req, res) => {
    const { user, name, brand_name, brand_description, web_url, facebook_url, instagram_url, twitter_url, linkedin_url, tiktok_url } = req.body

    const files = req.files
    if (!files.length) {
        return res.status(402).send({ message: 'Please provide logo images' })
    }
    if (!user) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    else if (!brand_name || !brand_description) {
        return res.status(402).send({ message: 'please provide req field name (brand name & brand description)' })
    }
    try {
        const obj = {
            user, brand_name, brand_description, web_url, facebook_url,
            instagram_url, twitter_url, linkedin_url, tiktok_url
        }
        const createBrand = await brand_model.create(obj)
        if (createBrand !== null) {
            let username = name.replace(/\s/g, '')
            const path = `${username}-${user}/${createBrand.brand_name}-${createBrand._id}/`

            await Promise.all(files.map(file => {
                const options = {
                    resumable: false,
                    metadata: {
                        contentType: file.type, // Replace with the appropriate content type
                    }
                }
                const blob = bucket.file(path + file.originalname)
                blob.createWriteStream(options).on('error', (err) => { throw err }).end(file.buffer)
            }))
                .then(() => {
                    return res.status(201).send({ message: createBrand.brand_name + ' Brand is Created ' })
                })
        } else {
            return res.status(400).send({ message: 'Found error Try again' })
        }


    } catch (err) {
        res.status(500).send({ message: 'Internal Server error' })
    }


}

const getBrandList = asyncHandler(async (req, res) => {
    const user = req.params.id
    if (!user) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    const brandList = await brand_model.find({ user: user }).exec()
    // console.log(brandList)
    if (brandList !== null) {
        const findingUser = await User.findById({ _id: user }).exec()
        if (findingUser) {
            let { _id: user_id, name } = findingUser

            let arr = []
            for (let i = 0; i < brandList.length; i++) {
                let obj = {}

                let { brand_name, _id } = brandList[i]
                brand_name = brand_name.replace(/\s/g, '')
                name = name.replace(/\s/g, '')
                const prefix = `${name}-${user_id}/${brand_name}-${_id}/`

                console.log(prefix)
                const [files] = await bucket.getFiles({ prefix })
                console.log(files)
                let filesInfo = files?.map((file) => {
                    let f = {}
                    f.id = uniqID(),
                        f.name = path.basename(file.name),
                        f.url = encodeURI(file.storage.apiEndpoint + '/' + file.bucket.name + '/' + file.name),
                        f.download_link = file.metadata.mediaLink,
                        f.type = file.metadata.contentType,
                        f.size = file.metadata.size,
                        f.time = file.metadata.timeCreated,
                        f.upated_time = file.metadata.updated
                    return f
                })
                // console.log('files ', filesInfo)
                obj.id = brandList[i]._id
                obj.user = brandList[i].user
                obj.brand_name = brandList[i].brand_name
                obj.brand_description = brandList[i].brand_description
                obj.web_url = brandList[i].web_url
                obj.facebook_url = brandList[i].facebook_url
                obj.instagram_url = brandList[i].instagram_url
                obj.twitter_url = brandList[i].twitter_url
                obj.linkedin_url = brandList[i].linkedin_url
                obj.tiktok_url = brandList[i].tiktok_url
                obj.files = filesInfo

                arr.push(obj)
                console.log(filesInfo)
            }
            if (arr.length > 0) {
                // console.log(arr)
                return res.status(200).json({ message: 'List Found', brandFiles: arr })
            } else {
                return res.status(200).send({ message: 'No Brands Found',brandFiles: arr  })
            }

        }
    } else {
        return res.status(400).json({ message: 'No brand found' })
    }
})

const deleteBrandList = async (req, res) => {
    const projectId = req.params.id
    if (!projectId) {
        return res.status(402).send({ message: 'ID not provided Try login again' })
    }
    try {
        const findBrand = await brand_model.findById({ _id: projectId })
        if (findBrand) {
            const findUser = await User.findById({ _id: findBrand.user })
            if (findUser) {
                // console.log(findUser)
                let { brand_name, _id: brand_id } = findBrand
                let { name, _id } = findUser
                brand_name = brand_name.replace(/\s/g, '')
                name = name.replace(/\s/g, '')
                const prefix = `${name}-${_id}/${brand_name}-${brand_id}/`

                const [files] = await bucket.getFiles({ prefix })
                await Promise.all(
                    files?.map(async (file) => {
                        try {
                            await file.delete();
                            // console.log(`Deleted file: ${file.name}`);
                        } catch (error) {
                            throw error
                        }
                    })
                ).then(async() => {
                    await brand_model.findByIdAndRemove(projectId)
                    return res.status(200).send({ message: 'Brand Deleted' })
                }).catch((err) => { throw err })
            } else {
                return res.status(400).send({ message: 'User Not Found try again!' })
            }
        } else {
            return res.status(404).send({ message: 'Brand Not Found' })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server error' })
    }

}

module.exports = { getBrandList, createBrand, deleteBrandList }