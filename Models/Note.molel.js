const mongoose = require('mongoose');
const Student = require('./Student.model');

const noteSchema = mongoose.Schema({
    studentId:{type:String , required :true},
    course:{type:String , required:true}, 
    description:{type:String } , 
    classNum:{type:Number  , required:true} , 
    rate:{type:Number  , default:0} , 
    filePath:{type:String , required:true} , 
    ratesNum:{type:Number  , default:0} ,
    postedDate:{type:Date , default:Date.now()}
})

const Note = mongoose.model('Note'  , noteSchema);

module.exports= Note;