require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ConnectDB = require('./config/DbConfig')
const cors = require('cors')
const { logger } = require('./middleware/logs')
const corsOptions = require('./config/corsOptions')
const { logEvents } = require('./middleware/logs')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const path = require('path')
// const { Server } = require("socket.io")
// const { Server } = require("socket.io")
const { createServer } = require("node:http")
const chatModel = require('./models/chat/chat-model')

const PORT = process.env.PORT
// const PORT = process.env.PORT || 5000
//App Config
ConnectDB()
app.use(express.static(path.join(__dirname, 'build')))
app.use(cors(corsOptions))
app.use(logger)
app.use(cookieParser())
app.use(express.json())
app.use('/', require('./routes/routes'))
app.use('/authentication/mi-sign-in', require('./routes/loginRoutes'))
app.use('/authentication/mi-sign-up', require('./routes/userRoutes'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'),
        (err) => {
            res.status(500).send(err)
        }
    )
    // }
})
// Sockets Connection
// const server = (app, {
//     origin: [process.env.NODE_ENV_FRONT_BASE_URL, 'http://localhost:4005'],
//     credentials: true,
// })

// const httpServer = createServer
// const io = new Server({
//     cors: {
//         origin: [process.env.NODE_ENV_FRONT_BASE_URL],
//         credentials: true,
//     }
// });

// const chatRooms = new Map();

// io.on("connection", (socket) => {

//     console.log(socket.id, 'a user connected');

//     socket.on('joinRoom', (room) => {
//         // Join the room
//         socket.join(room);

//         // Add the socket to the chat room
//         if (!chatRooms.has(room)) {
//             chatRooms.set(room, new Set());
//         }
//         chatRooms.get(room).add(socket);

//         // Broadcast a message to the room when a user joins
//         io.to(room).emit('message', 'A user has joined the room.');
//     });

//     socket.on('send-message', (message, room) => {
//         console.log('Message : ', message);
//         // Send the message to everyone in the room
//         io.to(room).emit('message', message);
//     });

//     socket.on('leaveRoom', (room) => {
//         // Remove the socket from the chat room
//         if (chatRooms.has(room)) {
//             chatRooms.get(room).delete(socket);

//             // If the room is empty, remove it from the map
//             if (chatRooms.get(room).size === 0) {
//                 chatRooms.delete(room);
//             }
//         }

//         // Leave the room
//         socket.leave(room);

//         // Broadcast a message to the room when a user leaves
//         io.to(room).emit('message', 'A user has left the room.');
//     });

//     // ...
// });



// Server 


// io.on("connection", (socket) => {
//     console.log("User Connected ", socket.id)
//     // socket.on("project_id", (id) => {
//     //     getPersonMessages(id)
//     //         .then(results => {
//     //             // console.log(results) 
//     //             const limit = results?.chat_msg.slice(-l)
//     //             const obj = {
//     //                 ...results,
//     //                 chat_msg : limit
//     //             }
//     //             socket.emit('found', results)
//     //         }).catch(e => {
//     //             // console.log('ERROR => ', e)
//     //             const obj = {
//     //                 chat_msg: []
//     //             }
//     //             socket.emit('found', obj)
//     //         })
//     // })
//     // socket.emit('current', socket.id)
//     socket.on("room-message", (message, room) => {
//         socket.join(room)
//         socket.to(room).emit("message", message)
//     })
// })

async function getPersonMessages(id) {
    return await chatModel
        .findOne({ project_id: id })
        .exec()
}


// io.listen(process.env.PORT)
// io.listen(4006)

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log(`Connected to MongoDB`)
    app.listen(PORT, () => {
        console.log(`Server started on Port : ${PORT}`)
    })
})

mongoose.connection.on('error', error => {
    console.log(error)
    logEvents(error.no + ' : ' + error.code + '\t' + error.syscall + '\t' + error.hostname, 'mongoErrorLog.log')
})
