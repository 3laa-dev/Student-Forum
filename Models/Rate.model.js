const mongoose = require('mongoose');
const rateSchema = mongoose.Schema({
raterId :{type:String , required:true},
noteId:{type:String , required:true},
rate:{type:Number , required:true  , min :  1 , max:5}
})

const Rate = mongoose.model('Rate' , rateSchema);

module.exports = Rate;