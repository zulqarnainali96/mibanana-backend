const asyncHandler = require("express-async-handler");
const uploadFilesToDrive = require("./uploadFile");


const uploadProjectFiles = asyncHandler(async (req, res) => {

    const upload = Promise.all(
        req.files.map(async (file) => {
            const fileId = await uploadFilesToDrive(file);
            return fileId;
        })
    );
    res.json({ message: 'Files uploaded successfully', fileIds: upload });
})

module.exports = uploadProjectFiles