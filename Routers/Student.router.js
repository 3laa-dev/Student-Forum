const express = require('express')
const router = express.Router();
const control = require('../Controls/Student.controls');
const validate = require('../Middlewares/Student.validation')
const verifyToken = require('../Middlewares/verifyToken');
const { Guid } = require('js-guid');
const multer = require('multer');
const AppError = require('../Utils/AppError');
const Status = require('../Utils/Status');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads')
    },
    filename: function (req, file, cb) {
        const fileName = Guid.newGuid().toString();
        const ext = file.mimetype.split('/')[1];
        cb(null, `${fileName}.${ext}`);
    }

})
const fileFilter = (req, file, cb) => {
    const ext = file.mimetype.split('/')[0];
    if(ext == 'image')
        return cb(null , true );
    else
        return cb(new AppError('file must be an image' , 400 ,Status.SUCCESS) , false);


}
const uploads = multer({storage:diskStorage , fileFilter:fileFilter});

router.post('/register', validate.registerValidation, control.register);
router.post('/login', control.login);
router.get('/getAllStudents', verifyToken, control.getAllStudents);
router.get('/getStudent/:ID', verifyToken, control.getStudent);
router.delete('/deleteStudent/:ID', verifyToken, control.deleteStudent);
router.patch('/updateStudent/:ID', verifyToken, control.updateStudent);
router.patch('/updateAvatar',verifyToken , uploads.single('avatar') , control.uploadAvatar);
module.exports = router;