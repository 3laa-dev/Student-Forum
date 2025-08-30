const mongoose = require('mongoose');
const DeletedPostSchema = mongoose.Schema({
    posterId:{type:String , required:true},
    title:{type:String , required:true},
    content:{type:String , required:true},
    postedDate:{type:Date , default:Date.now()},
    likesNumber:{type:Number , default:0}   , 
    commentsNumber:{type:Number , default:0} , 
    imagePath:{type:String},
    deleterId:{type:String , required:true}
})

const Student = mongoose.model('DeletedPost',DeletedPostSchema);
module.exports = Student;