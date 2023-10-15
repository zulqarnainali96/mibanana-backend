const { folderName, listFolders, drive } = require("../../google_api/config")

const asyncHandler = require("express-async-handler")
const fs = require('fs')


const uploadFilesToDrive = async (file) => {
    const folder = await listFolders(folderName)
    try {
        const res = await drive.files.create({
            requestBody: {
                name: file.originalName,
                mimeType: file.mimeType,
                parents: [folder.id]
            },
            media: {
                mimeType: file.mimeType,
                body: file.buffer
            }
        })
        // console.log("Upload File => ", res.data.id)
        return res.data.id
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
}

module.exports = uploadFilesToDrive