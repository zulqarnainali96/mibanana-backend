
// const uploadFile = async (req, res) => {
//     if (!req.files) {
//         return res.status(400).send({ message: 'No File Provided' })
//     }
//     try {
//         if (req.files?.length > 0) {
//             let files = req.files
//             for (let i = 0; i < files.length; i++) {
//                 const blob = bucket.file(files[i].originalName)
//                 const blobStram = blob.createWriteStream({
//                     resumable: false
//                 })
//                 blobStram.on('error', (err) => {
//                     res.status(500).send({ message: err.message })
//                     console.log('found error while uploading')
//                     return
//                 })
//                 blobStram.on('finish', async (data) => {
//                     filesArray.push({
//                         imageUrl: format(
//                             `https://storage.googleapis.com/${bucket.name}/${blob.name}`
//                         )
//                     })
//                     try {
//                         await bucket.file(files[i].originalName).makePublic()
//                     } catch {
//                         return res.status(500).send({
//                             message:
//                                 `Uploaded the file successfully: ${files[i].originalname}, but public access is denied!`,
//                             url: publicUrl,
//                         });
//                     }
//                     res.status(200).send({
//                         message: "Uploaded the file successfully: " + files[i].originalname,
//                         url: publicUrl,
//                     })
//                 })
//                 blobStram.end(req.file.buffer);

//             }
//         }
//     } catch (err) {
//         res.status(500).send({
//             message: `Could not upload the file: ${req.file.originalname}. ${err}`,
//         });
//     }
// }








// const uploadFile = async (req, res) => {
//     const files = req.files
//     if (!req.files || req.file) {
//         return res.status(400).send({ message: 'no files uploaded' })
//     }
//     try {
//         if (files?.length > 0) {
//             for (let i = 0; i < files.length; i++) {
//                 const options = {
//                     destination: files[i],
//                     preconditionOpts: {
//                         ifGenerationMatch: generationMatchPreCondition
//                     }
//                 }
//                 await bucket.upload(filePath, options)
//                 console.log('file uploaded to bucket name ', bucketName)
//             }
//         }
//     }
//     catch (error) {
//         console.log(error.message)
//     }
// }
// module.exports = uploadFile
// createFolder()

// exports.getFiles = async () => {
//     try {
//         const [files] = await bucket.getFiles()
//         let filesInfo = []
//         files.forEach(file => {
//             filesInfo.push({
//                 name: file.name,
//                 url: file.metadata.mediaLink
//             })
//         })
//         console.log(filesInfo)
//         // res.status(200).send({ messge: 'file found', filesInfo })
//     } catch (err) {
//         console.log(err)
//     }
// }
// const path = require('path')
// const name = 'Zainhashmi-65202ed775923928527367b2/youtubework-6523a9815896e2a6ae0db162/New Project form.docx'
// console.log(path.basename(name))

// let arr = [{
//     name : 'zain',
//     age : 23,
//     profession : 'Doctor'
// }]

// const f = arr.map( async(item) => {
//     let obj = {};
//     obj.n = item.name,
//     obj.a = item.age,
//     obj.p = item.profession
//     return obj
// })
// console.log('Asynchronous')
// console.log(f)

// console.log('d',d)

const arr = ['zain','ali','fasseh']

const ccc = [
    { id : 1, name : 'zain'},
    { id : 1, name : 'ali'},
    { id : 1, name : 'fasseh'},
    { id : 1, name : 'rashid'},
    { id : 1, name : 'mmm'},
]

const res = ccc.filter(item=> !arr.some(item2 => item.name === item2))

console.log(res)