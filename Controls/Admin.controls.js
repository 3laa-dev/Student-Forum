const Admin = require('../Models/Admin.model');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const AppError = require('../Utils/AppError');
const Status = require('../Utils/Status');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const generateJWT = require('../Utils/generateJWT');


const register = asyncWrapper(async (req, res, next) => {
    const { role, firstName, lastName, email, password } = req.body;

    const isExists = await Admin.find({ email });

    if (isExists.length > 0)
        return next(new AppError('this admin is exists', 400, Status.FAIL))

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppError(errors.array().map(e => e.msg), 400, Status.FAIL)
        return next(error);
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ role, firstName, lastName, email, password: hashedPassword });
    newAdmin.save();
    return res.json({ Status: Status.SUCCESS, newAdmin: newAdmin });

});
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;


    if (!email || !password)
        return next(new AppError('email and password is required', 400, Status.FAIL));

    const admin = await Admin.findOne({ email });

    if (!admin)
        return next(new AppError('this admin account is not exists', 400, Status.FAIL));

    const machedPassword = await bcrypt.compare(password, admin.password);
    if (!machedPassword)
        return next(new AppError('you entered false password', 400, Status.FAIL));

    const token = generateJWT({ email: admin.email, id: admin._id });
    admin.token = token;
    await admin.save();
    return res.json({ Status: Status.SUCCESS, Admin: admin });
})




module.exports = { register , login }