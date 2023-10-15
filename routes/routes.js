const express = require('express')
const router = express.Router()
const parser = require("../storage_service/cloudinary")
const { createGraphicDesign, getGraphicProject, upadteProject, deleteGraphicProject, getCustomerFiles } = require('../controllers/graphicDesign')
const { postCompanyDetails,
    updateProfile,
    getCompanyDetails,
} = require("../controllers/profileSetting")
const { upload } = require("../google_api/config")
const multer = require('multer')
const uploadFiles = multer({
    storage: multer.memoryStorage()
})


const { graphicCategory } = require("../controllers/Projects/Graphic_design/category")
const { createGraphicProject, getAssignGraphicProject, getDesignerList } = require('../controllers/Team-Members/Designers/designerProjects')
const { createChatController, getProjectChat } = require('../controllers/chat/chat_controller')
const { fileUploader, getProfileData, updateCustomerProfile } = require('../controllers/cloudinary_control')
const uploadProjectFiles = require('../controllers/Upload Files/uploadFileController')
const { getBrandList, createBrand, deleteBrandList } = require('../controllers/Brand/brandController')
const changePassword = require('../controllers/forgetPassControll')
const verifyToken = require('../controllers/verifyEmail/verify-email-control')
const { downloadFile, getFiles, uploadFile } = require('../google-cloud-storage/gCloudStorage')
const { designerUpload, getDesignerFiles, deleteDesigners } = require('../controllers/Projects/Graphic_design/designer_upload')

// Route for Company profile Data
router.post("/settings/company-profile", postCompanyDetails)
router.get("/settings/company-profile/:id", getCompanyDetails)
router.patch("/settings/company-profile", updateProfile)


// Route for Creating Graphic Project Controller
router.get("/get-customer-files/:id", getCustomerFiles)
router.get("/graphic-project/:id", getGraphicProject)
router.delete("/graphic-project/:id", deleteGraphicProject)
router.route("/graphic-project")
    .post(createGraphicDesign)
    .patch(upadteProject)

// router.get("/authentication/sign-in", graphicCategory)

// Route for Assigning project to Graphic getDesignerList

router.post("/assign-graphic-project", createGraphicProject)
router.get("/assign-graphic-project/:id", getAssignGraphicProject)


// get Designer List ===> project manager route
router.get("/api/get-designer-list/:id", getDesignerList)
router.post('/delete-designer', deleteDesigners)



// Saving chat message controller routes 
router.put("/chat-message", createChatController)
router.get("/chat-message/:id", getProjectChat)

// // Route for Profile Data Cloudinary
router.post('/api/settings-profile', parser.single('avatar'), fileUploader)
router.post('/api/settings-update-profile', updateCustomerProfile)
router.get('/api/settings-profile/:id', getProfileData)


// Google Drive Route not tested 
router.post("/api/upload-project-files", upload.array('files', 5), uploadProjectFiles)


// Route for creating and getting brand 
router.post("/api/brand", uploadFiles.array('files', 7), createBrand)
router.get("/api/brand/:id", getBrandList)
router.delete("/api/brand/:id", deleteBrandList)

// Route for changing password 
router.put("/api/settings/forget-password", changePassword)

router.get("/auth/user/:id/verify/:token", verifyToken)


// Route for posting adding and get project files

router.post('/file/google-cloud/', uploadFiles.array('files', 7), uploadFile)
router.post('/file/get-files', getFiles)
router.get('/get-files/download/:name', downloadFile)


// Route for Designer Uploading files releated to project

router.post('/api/designer-uploads/:id', uploadFiles.array('files', 5), designerUpload)
router.get('/api/designer-uploads/:id', getDesignerFiles)


module.exports = router 