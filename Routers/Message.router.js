const express = require('express');
const router = express.Router();
const control = require('../Controls/Message.controls');
const verifyToken  = require('../Middlewares/verifyToken');


router.post('/sendMessage/:targetId' , verifyToken ,  control.sendMessage);
router.get('/getAllChats/:id' , verifyToken ,control.getAllChats);
router.get('/getAllMessages/:chatId' ,verifyToken ,control.getAllMessages);

module.exports  = router ;