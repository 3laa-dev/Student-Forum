const validator = require('validator');
const mongoose = require('mongoose');
const StudentSchema = mongoose.Schema({
    firstName:{type:String , required:true},
    lastName:{type:String , required:true},
    email:{type:String , required:true , unique:true , validate:[validator.isEmail , "this not email" ]},
    password:{type:String , required:true  },
    avatar:{type:String , default:"Uploads/DefaultSudentAvatar.png"} , 
    token:{type:String}
})

const Student = mongoose.model('Student',StudentSchema);
module.exports = Student;