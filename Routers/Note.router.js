const express = require('express');
const router = express.Router();
const control = require('../Controls/Note.controls');
const verifyToken = require('../Middlewares/verifyToken');
const multer = require('multer');
const { Guid } = require('js-guid');
const AppError = require('../Utils/AppError');
const Status = require('../Utils/Status');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads');
    },
    filename: function (req, file, cb) {
        const fileName = Guid.newGuid().toString();
        const ext = file.mimetype.split('/')[1];
        cb(null, `${fileName}.${ext}`);
    }
})
const fileFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')[1];
    if (type == 'pdf')
        return cb(null, true);
    else
        return cb(new AppError('file must be a pdf' , 404 , Status.FAIL) );
}
const uploads = multer({storage:diskStorage  , fileFilter:fileFilter});

router.post('/addNote', verifyToken,  uploads.single('filePath') , control.addNote);
router.get('/getAllNotes', verifyToken , control.getAllNotes);
router.post('/rateThis/:noteId' , verifyToken , control.rateThis);
router.get('/isRated/:noteId' , verifyToken , control.isRated);



module.exports = router;