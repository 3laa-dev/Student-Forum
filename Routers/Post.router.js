const express = require('express')
const router = express.Router();
const control = require('../Controls/Post.controls');
const verifyToken = require('../Middlewares/verifyToken');
const {Guid} = require('js-guid');
const multer = require('multer');
const AppError = require('../Utils/AppError');
const Status = require('../Utils/Status');
const diskStorage = multer.diskStorage({
    destination: function (req , file , cb){
        cb(null , 'Uploads')
    } , 
    filename:function (req , file , cb){
        const ext = file.mimetype.split('/')[1];
        const fileName = Guid.newGuid().toString();   
        cb(null , `${fileName}.${ext}` );
    }
})
const fileFilter = (req , file , cb)=>{
    const type = file.mimetype.split('/')[0];
    if(type == 'image')
       return cb(null  , true)
    else
      return  cb(new AppError('file must be an image' , 400 ,Status.FAIL ) , false)
}
const uploads = multer({storage:diskStorage , fileFilter:fileFilter});




router.post('/addPost' , verifyToken   , uploads.single('imagePath') , control.addPost );
router.delete('/deletePost/:postID' , verifyToken ,control.deletePost );
router.patch('/updatePost/:postID' , verifyToken , control.updatePost)
router.get('/getAllPosts' , control.getAllPosts);
router.get('/getAllPosts/:posterId' , control.getAllPosts);
router.get('/addLike/:postID'  , verifyToken , control.addLike);
router.post('/addComment/:postId' , verifyToken , control.addComment);
router.delete('/deleteComment/:commentId' , verifyToken , control.deleteComment);
router.get('/getComments/:postId'  , verifyToken , control.getAllComments);
router.get('/isLiked/:postId',verifyToken , control.isLiked);
module.exports = router;