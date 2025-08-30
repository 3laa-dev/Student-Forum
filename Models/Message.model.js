const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    senderId:{type:String , required:true} , 
    chatId :{type:String , required:true} , 
    sentDate:{type:Date , default:Date.now()} 
})

const Message = mongoose.model('Message' , messageSchema);

module.exports = Message;