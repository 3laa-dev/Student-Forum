const express = require('express');
const app = express();
const Status = require('./Utils/Status');
const mongoose = require('mongoose');
const path = require('path');


//----------------< Connection >-----------------
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const messageControl = require('./Controls/Message.controls');


const users = new Map();

messageControl.init(io, users);


io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);


    socket.on("registerSocket", (userId) => {
        users.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });


    socket.on("disconnect", () => {
        for (const [userId, id] of users.entries()) {
            if (id === socket.id) {
                users.delete(userId);
                console.log(` User ${userId} disconnected`);
                break;
            }
        }
    });

})


//----------------------------------------------

require('dotenv').config();

const url = process.env.DATABASE_CONNECTION_PATH;
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });


const studentRouter = require('./Routers/Student.router');
const postRouter = require('./Routers/Post.router');
const noteRouter = require('./Routers/Note.router');
const messageRouter = require('./Routers/Message.router');
const adminRouter = require('./Routers/Admin.router');
const inquirieRouter = require('./Routers/Inquirie.router');

app.use(express.json());
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/api/students', studentRouter);
app.use('/api/post', postRouter);
app.use('/api/note', noteRouter);
app.use('/api/message', messageRouter);
app.use('/api/admin' , adminRouter);
app.use('/api/inquirie' , inquirieRouter )

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500)
        .json({
            status: error.statusText || Status.ERROR,
            message: error.message,
            statusCode: error.statusCode,
            data: null
        })
})




server.listen(process.env.PORT, () => {
    console.log("server is listen on port:", 1000);

})