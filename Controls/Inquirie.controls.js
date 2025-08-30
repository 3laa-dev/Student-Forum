const asyncWrapper = require('../Middlewares/asyncWrapper');
const Inquirie = require('../Models/Inquirie.model');
const Status = require('../Utils/Status');

const addInquirie = asyncWrapper( async (req , res , next)=>{
    const user = req.user;
    const {inquirie} = req.body
    const newInquirie = new Inquirie({studentId:user.id , inquirie });
    await newInquirie.save();
    res.json({Status:Status.SUCCESS , Inquirie : inquirie})
})
const addRes = asyncWrapper( async (req , res , next)=>{
    const user = req.user;
    const inquirieId = req.params.inquirieId;
    const inquirie = await Inquirie.findByIdAndUpdate(inquirieId ,
         {response:req.body.response ,responserId:user.id },
        {new : true});
    return res.json({Status:Status.SUCCESS , Inquirie : inquirie});
    
})

module.exports = {addInquirie , addRes};