const validator = require('validator');
const mongoose = require('mongoose');


const adminSchema = mongoose.Schema({
    role: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, "this not email"] },
    password: { type: String, required: true },
  //avatar: { type: String, default: "Uploads/DefaultSudentAvatar.png" },
    canDoActive:{type:Boolean , default:false},
    isActive : {type:Boolean , default:false} ,
    token: { type: String }
})

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
