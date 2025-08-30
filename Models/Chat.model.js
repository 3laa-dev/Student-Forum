const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    user1Id:{type:String , required:true},
    user2Id:{type:String , required:true},
})

const Chat = mongoose.model('Chat' , chatSchema);

module.exports = Chat;