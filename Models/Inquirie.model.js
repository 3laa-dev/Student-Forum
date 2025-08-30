

const mongoose = require('mongoose');
const inquirieSchema = mongoose.Schema({
    studentId:{type:String , required:true},
    responserId:{type:String },
    inquirie:{type:String , required:true},
    response:{type:String }
});

const Inquirie = mongoose.model('Inquirie',inquirieSchema);
module.exports = Inquirie;