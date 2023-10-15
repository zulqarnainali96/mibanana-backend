const { google } = require('googleapis')
const path = require("path")
const fs = require("fs")
const multer = require("multer")
const storage = multer.memoryStorage()
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env


const upload = multer({ storage: storage })
const RefreshToken = REFRESH_TOKEN

const OauthClient = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
)

OauthClient.setCredentials({ refresh_token: RefreshToken })

const drive = google.drive({
    version: 'v3',
    auth: OauthClient,
})
const folderName = 'mibanana'




// const filepath = path.join(__dirname, "aa.png")

// async function upload() {
//     const folderName = 'mibanana'
//     const folder = await listFolders(folderName)

//     const res = await drive.files.create({
//         requestBody: {
//             name: 'files1',
//             mimeType: 'image/png',
//             parents : [folder?.id] // Include the folder ID here

//         },
//         media: {
//             mimeType: 'text/plain',
//             body: fs.createReadStream(filepath)
//         }
//     });
//     console.log(res.data)
// }

async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: '1zQAgASGNWy2v82H5-HybA8YgPIO8pLij',// file id
        });
        // console.log(response.data, response.status);
    } catch (error) {
        console.log(error.message);
    }
}

// deleteFile()

async function listFolders(folderName) {
    const response = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    });

    if (response.data.files.length > 0) {
        // Folder with the specified name already exists
        return response.data.files[0];
    } else {
        // Folder doesn't exist; create it
        const folder = await createFolder(folderName);
        return folder;
    }
}



// upload()

module.exports = { drive, folderName, listFolders, upload }

// router.get("/auth/google", (req, res) => {
//     console.log("runing")
//     const url = OauthClient.generateAuthUrl({
//         access_type: 'offline',
//         scope: [
//             "https://www.googleapis.com/auth/userinfo.profile",
//             "https://www.googleapis.com/auth/drive",
//         ]
//     })
//     res.redirect(url)
// })

// router.get("/google/redirect", async (req, res) => {
//     console.log("runing 2")
//     const { code } = req.query
//     const { tokens } = await OauthClient.getToken(code)
//     OauthClient.setCredentials(tokens)
//     fs.writeFileSync("creds.json", JSON.stringify(tokens))
//     res.send("SUCCESS")
// })