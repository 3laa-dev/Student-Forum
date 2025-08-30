const Message = require('../Models/Message.model');
const Chat = require('../Models/Chat.model');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const Status = require('../Utils/Status');




let users;
let io;

const init = (ioInstance, usersMap) => {
    io = ioInstance;
    users = usersMap;
};


const sendMessage = asyncWrapper(async (req, res, next) => {
    const senderId = req.user.id;
    const targetId = req.params.targetId;
    const { text } = req.body;

    const chat = await Chat.find({
        $or: [
            { user1Id: senderId, user2Id: targetId },
            { user1Id: targetId, user2Id: senderId }
        ]
    })

    if (!chat) {
        chat = new Chat({ user1Id: senderId, user2Id: targetId });
        await chat.save();
    }

    const newMessage = new Message({ senderId, chatId: chat._id });
    await newMessage.save();

    const targetSocketId = users.get(targetId);
    if (targetSocketId) {
        io.to(targetSocketId).emit("receiveMessage", { text, senderId });
    }

    return res.json({ Status: Status.SUCCESS, text });


})
const getAllChats = asyncWrapper(async (req, res, next) => {
    const user = req.params;
    const chats = await Chat.find({ $or: [{ user1Id: user.id }, { user2Id: user.id }] });
    return res.json({ Status: Status.SUCCESS, Chats: chats });
})
const getAllMessages = asyncWrapper(async (req, res, next) => {
    const chatId = req.params.chatId;
    const user = req.user;
    const messages = await Message.find({_id:chatId ,  $or: [{ user1Id: user.id }, { user2Id: user.id }]});
    return res.json({Status:Status.SUCCESS  , Messages:messages})

})




module.exports = { init, sendMessage  , getAllChats , getAllMessages}