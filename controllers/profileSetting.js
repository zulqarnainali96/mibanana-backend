const asyncHandler = require("express-async-handler")
const { CompanyDetaitls } = require("../models/profile-settings")

const postCompanyDetails = asyncHandler(async (req, res) => {
    const { id, company_name, contact_person, company_size, primary_email, primary_phone, time_zone, company_address } = req.body

    if (!id) {
        return res.status(400).json({ message: "Please Provide ID" })
    }
    if (company_name || contact_person || company_size || primary_email || primary_phone || time_zone || company_address) {
        const comProfile = await CompanyDetaitls.findOne({user : id}).exec()
        if(comProfile !== null){
            comProfile.user = id
            comProfile.company_name = company_name
            comProfile.company_address = company_address
            comProfile.contact_person = contact_person
            comProfile.company_size = company_size
            comProfile.primary_email = primary_email
            comProfile.primary_phone = primary_phone
            comProfile.time_zone = time_zone
            const save = await comProfile.save()
            if(save!==null) return res.status(201).json({message:"Company Profile Upadted"})

        }
        const obj = { user: id, company_name, contact_person, company_size, primary_email, primary_phone, time_zone, company_address, }
        const save = await CompanyDetaitls.create(obj)
        if (save) {
            return res.status(200).json({ message: 'Company Details Added'})
        } else {
            return res.status(400).json({ message: 'Invalid user data' })
        }
    }
    return res.status(404).json({ message: 'No Data Found' })
})

const updateProfile = asyncHandler(async (req, res) => {
    const id = req.params.id
    const { company_name, contact_person, company_size, primary_email, primary_phone, time_zone, company_address } = req.body
    if (!id) {
        return res.status(400).json({ message: "Please Provide ID" })
    }
    const findingProfile = await CompanyDetaitls.findById(id)
    if (findingProfile) {
        findingProfile.company_name = company_name
        findingProfile.contact_person = contact_person
        findingProfile.company_size = company_size
        findingProfile.primary_email = primary_email
        findingProfile.primary_phone = primary_phone
        findingProfile.time_zone = time_zone
        findingProfile.company_address = company_address
        await findingProfile.save()
        return res.status(201).send({ message: 'Company Profile Updated' })
    } else {
        return res.status(400).send({ message: 'No Data Found' })
    }
})


const getCompanyDetails = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({ message: "Please Provide ID" })
    }
    const details = await CompanyDetaitls.findOne({ user: id }).exec()
    if (details) {
        return res.status(200).json({ company_data: details })
    }
    else if (details === null) {
        return res.status(404).json({ message: 'No data found' })
    }
    return res.status(500).json({ message: 'Server error' })

})


// Profile Api Functions 

// const createProfileData = asyncHandler(async (req, res) => {
//     const { id, phone, email, fullName, image } = req.body
//     console.log( " Phone ",  image)
//     if (!id) {
//         return res.status(400).json({ message: "Invalid UserID Please Login again" })
//     }
//     if (!email && !fullName) {
//         return res.status(400).json({ message: "email, fullName are required fields" })
//     }
//     if (email && fullName && id) {
//         const creatingProfileObj = await ProfileDetails.create({user : id, email, fullName, phone, image })
//         if (creatingProfileObj) {
//             return res.status(200).json({ message: "Profile Data Created" })
//         }
//         else {
//             return res.status(400).json({ message: "Invalid User Data" })
//         }
//     }
//     return res.status(404).json({ message: 'Unable to create data' })
// })

// const getProfileData = asyncHandler(async (req, res) => {
//     const { id } = req.body
//     if (!id) {
//         return res.status(400).json({ message: "Invalid UserID Please Login again" })
//     }
//     if (id) {
//         const ProfileData = await ProfileDetails.find({ user: id }).exec()
//         if (ProfileData?.length) {
//             return res.status(200).json({ ProfileData })
//         } else {
//             return res.status(404).json({ message: "No Data Found" })
//         }
//     }
//     return res.status(404).json({ message: "Invalid ID" })
// })


module.exports = { postCompanyDetails, getCompanyDetails, updateProfile }