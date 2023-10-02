const express = require('express')
const router = express.Router()
const parser = require("../storage_service/cloudinary")
const { createGraphicDesign, getGraphicProject, upadteProject } = require('../controllers/graphicDesign')
const { postCompanyDetails,
    updateProfile,
    getCompanyDetails,
} = require("../controllers/profileSetting")
const { upload } = require("../google_api/config")


const { graphicCategory } = require("../controllers/Projects/Graphic_design/category")
const { createGraphicProject, getAssignGraphicProject, getDesignerList } = require('../controllers/Team-Members/Designers/designerProjects')
const { createChatController, getProjectChat } = require('../controllers/chat/chat_controller')
const { fileUploader, getProfileData } = require('../controllers/cloudinary_control')
const uploadProjectFiles = require('../controllers/Upload Files/uploadFileController')
const { getBrandList, createBrand } = require('../controllers/Brand/brandController')
const changePassword = require('../controllers/forgetPassControll')

// Route for Company profile Data
router.post("/settings/company-profile", postCompanyDetails)
router.get("/settings/company-profile/:id", getCompanyDetails)
router.patch("/settings/company-profile", updateProfile)


// Route for Creating Graphic Project Controller
router.get("/graphic-project/:id", getGraphicProject)
router.route("/graphic-project")
    .post(createGraphicDesign)
    .patch(upadteProject)

// router.get("/authentication/sign-in", graphicCategory)

// Route for Assigning project to Graphic getDesignerList

router.post("/assign-graphic-project", createGraphicProject)
router.get("/assign-graphic-project/:id", getAssignGraphicProject)


// get Designer List ===> project manager route
router.get("/api/get-designer-list/:id", getDesignerList)



// Saving chat message controller routes 
router.put("/chat-message", createChatController)
router.get("/chat-message/:id", getProjectChat)

// // Route for Profile Data Cloudinary
router.post('/api/settings-profile', parser.single('avatar'), fileUploader)
router.get('/api/settings-profile/:id', getProfileData)


// Google Drive Route not tested 
router.post("/api/upload-project-files", upload.array('files', 5), uploadProjectFiles)


// Route for creating and getting brand 
router.post("/api/brand", createBrand)
router.get("/api/brand/:id", getBrandList)

// Route for changing password 
router.put("/api/settings/forget-password", changePassword)

module.exports = router