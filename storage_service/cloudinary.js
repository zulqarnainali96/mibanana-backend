// Cloudinary
const cloudinary = require('cloudinary').v2 
const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET   
})

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,

    params : {
        folder : 'uploads/profile',
        format: async (req, file) => {
            // Determine the format based on the MIME type of the uploaded file
            const allowedFormats = ['png', 'jpg', 'jpeg', 'gif']; // Add your allowed formats here
      
            // Check if the file's MIME type is in the allowed formats
            const mimeParts = file.mimetype.split('/');
            const fileFormat = mimeParts[1];
            
            if (allowedFormats.includes(fileFormat)) {
              return fileFormat;
            } else {
              // Default to 'png' if the format is not allowed
              return 'png';
            }
          },
          public_id : (req, file) => file.fieldname,
          // {
          //   console.log(file)
          // },
          overwrite : true
    }
})

const parser = multer({storage : storage})

module.exports = parser;