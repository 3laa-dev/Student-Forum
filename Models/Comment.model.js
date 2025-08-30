const mongoose = require('mongoose');
const CommentSchema = mongoose.Schema({
    postId:{type:String , required:true},
    commenterId:{type:String , required:true},
    content:{type:String , required:true},
    commentedDate:{type:Date , default:Date.now()},
})

const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;