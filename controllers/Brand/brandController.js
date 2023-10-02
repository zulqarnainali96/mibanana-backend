const asyncHandler = require('express-async-handler')
const brand_model = require("../../models/Brands/brandModel")


const createBrand = asyncHandler(async (req, res) => {
    const { id, user, brand_name, brand_description, web_url, facebook_url, instagram_url, twitter_url, linkedin_url, tiktok_url } = req.body

    if (!id) {
        if (!user) {
            return res.status(402).json({ message: "UserId not provided Try Login again" })
        }
        else if (!brand_name && !brand_description) {
            return res.status(402).json({ message: "Please provide req field (brand name, brand descr)" })
        }
        else if (user && brand_name && brand_description) {
            const obj = {
                user, brand_name, brand_description, web_url, facebook_url, instagram_url, twitter_url, linkedin_url,
                tiktok_url
            }
            const createBrand = await brand_model.create(obj)
            if (createBrand !== null) {
                return res.status(200).json({ message: `${createBrand?.brand_name} Brand is Created ` })
            }
            return res.status(400).json({ message: 'found Error cannot create brand' })
        }
    } else {
        const SingleList = await brand_model.findById(id).exec()
        if (SingleList !== null) {
            SingleList.user = user
            SingleList.brand_name = brand_name
            SingleList.brand_description = brand_description
            SingleList.web_url = web_url
            SingleList.facebook_url = facebook_url
            SingleList.instagram_url = instagram_url
            SingleList.twitter_url = twitter_url
            SingleList.linkedin_url = linkedin_url
            SingleList.tiktok_url = tiktok_url

            const result = SingleList.save()
            if (result !== null) {
                return res.status(404).json({ message: 'Brand List Updated', result })
            }
        }
    }

    return res.status(404).json({ message: 'Data not found' })
})

const getBrandList = asyncHandler(async (req, res) => {
    const user = req.params.id

    const brandList = await brand_model.find({ user: user }).exec()
    if (brandList !== null) {
        return res.status(200).json({ message: 'List Found', brandList })
    } else {
        return res.status(400).json({ message: 'No brand found' })
    }
})

module.exports = { getBrandList, createBrand }