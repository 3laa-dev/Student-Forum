const mongoose = require('mongoose');
const likeSchema = mongoose.Schema({
    postId:{type:String , required:true},
    likerId:{type:String , required:true}
})

const Like = mongoose.model('Like',likeSchema);
module.exports = Like;