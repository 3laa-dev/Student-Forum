const asyncWrapper = require('../Middlewares/asyncWrapper');
const AppError = require('../Utils/AppError');
const Student = require('../Models/Student.model');
const Status = require('../Utils/Status');
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const generateJWT = require('../Utils/generateJWT');

const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const test = await Student.findOne({ email });
    if (test) {
        next(new AppError('this student is exists', 400, Status.FAIL));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppError(errors.array().map(e => e.msg), 400, Status.FAIL)
        return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ firstName, lastName, email, password: hashedPassword });
    const token = await generateJWT({email:newStudent.email , id:newStudent._id});
    newStudent.token=token;
    await newStudent.save();
    res.json({ Status: Status.SUCCESS,  NewStudent: newStudent  })
})
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new AppError('email and password is required', 400, Status.FAIL));

    const student = await Student.findOne({ email });
    if(!student)
       return next(new AppError('student is not exists', 400, Status.FAIL));

    const machedPassword = await bcrypt.compare(password, student.password);
    if ( !machedPassword) {
        return next(new AppError("password is false" , 400 , Status.FAIL));
    }
    
    
    const token = generateJWT({email:student.email , id:student._id})
    student.token = token;
    student.save();

    res.json({ Status: Status.SUCCESS,  Student: student  })

})
const getAllStudents = asyncWrapper (async (req , res , next)=>{
    const students = await Student.find({},{__v:false , password:false , token:false});
    res.json({Status:Status.SUCCESS , Students:students});
})
const getStudent =asyncWrapper( async (req , res , next)=>{
    const student = await Student.findById(req.params.ID , {__v:false , password:false , token:false});
    if(student)
        res.json({Status:Status.SUCCESS , Student:student});
    else
        next(new AppError("student is not found" , 400 , Status.FAIL))
})
const deleteStudent = asyncWrapper( async(req , res , next)=>{
    const user = req.user ;
    const ID = req.params.ID
    if(user.id.toString() !== ID.toString() )
       return next(new AppError("You cant delete other student." , 400 , Status.FAIL));
    const student = await Student.findByIdAndDelete(ID);
    res.json({Status:Status.SUCCESS , data :null})
})
const updateStudent = asyncWrapper(async (req , res , next)=>{
    const user = req.user ;
    const ID = req.params.ID
    if(user.id.toString() !== ID.toString() )
        return next(new AppError("You cant update other student." , 400 , Status.FAIL));

    const {password} = req.body;
    if(password){
        const hashedPassword = await bcrypt.hash(password  , 10);
        const student = await Student.findById(ID);
        student.password = hashedPassword;
        student.save();
        return res.json({Status:Status.SUCCESS , updateStudent:student});
    }

    await Student.findByIdAndUpdate(ID  , {...req.body});
    const student = await Student.findById(ID, {__v:false , password:false , token:false});
    res.json({Status:Status.SUCCESS , updateStudent:student});
    

})
const uploadAvatar = asyncWrapper( async (req , res , next)=>{
    const user = req.user;
    const avatar = req.file.path;
    const student = await Student.findById(user.id);
    student.avatar=avatar;
    await student.save();
    res.json({Status:Status.SUCCESS , NewAvatarPath:avatar});
})


module.exports = { register, login , getAllStudents , getStudent , deleteStudent , updateStudent , uploadAvatar}