const asyncWrapper = require('../Middlewares/asyncWrapper');
const Post = require('../Models/Post.model');
const Status = require('../Utils/Status');
const AppError = require('../Utils/AppError');
const Like = require('../Models/Likes.model');
const Comment = require('../Models/Comment.model');
const DeletedPost = require('../Models/DeletedPost');


const addPost = asyncWrapper(async (req, res, next) => {
    const user = req.user;
    const { title, content } = req.body;
    const newPost = new Post({ title, content, posterId: user.id });
    newPost.imagePath = req.file ? req.file.path : null;
    await newPost.save();
    res.json({ Status: Status.SUCCESS, NewPost: newPost });
})
const deletePost = asyncWrapper(async (req, res, next) => {

    const postId = req.params.postID;
    const user = req.user;


    const post = await Post.findById(postId);

    if (!post)
        return next(new AppError('this post is not found', 404, Status.FAIL));

    if (post.posterId.toString() !== user.id.toString())
        return next(new AppError('this post is not for you', 403, Status.FAIL));

    await Post.findByIdAndDelete(postId);
    const deletedPost = new DeletedPost({ ...post.toObject(), deleterId: user.id });
    await deletedPost.save();

    res.json({ Status: Status.SUCCESS, data: null })
})
const updatePost = asyncWrapper(async (req, res, next) => {
    const postID = req.params.postID;
    const userID = req.user.id
    const post = await Post.findById(postID);
    if (!post)
        return next(new AppError('post is not exists'));

    if (userID.toString() === post.posterId.toString()) {
        const updated = await Post.findByIdAndUpdate(postID, { ...req.body }, { new: true })
        return res.json({ Status: Status.SUCCESS, UpdatedPost: updated });
    }
    next(new AppError("you can't updat this post", 400, Status.FAIL));

})
const getAllPosts = asyncWrapper(async (req, res, next) => {
    const posterId = req.params.posterId;
    var posts;
    if (posterId)
        posts = await Post.find({ posterId }, { __V: false });
    else
        posts = await Post.find({}, { __V: false });

    res.json({ Status: Status.SUCCESS, Posts: posts })

})
const addLike = asyncWrapper(async (req, res, next) => {
    const post = await Post.findById(req.params.postID);
    if (!post)
        return next(new AppError('this post is not exists', 400, Status.FAIL));
    const user = req.user;


    if (!user)
        return next(new AppError('Error', 500, Status.ERROR));

    const isLiked = await Like.find({ postId: post._id, likerId: user.id });
    if (isLiked.length > 0)
        return next(new AppError('you are liked this post', 404, Status.FAIL));

    const newLike = new Like({ postId: post._id, likerId: user.id });
    post.likesNumber++;
    await newLike.save();
    await post.save();
    return res.json({ Status: Status.SUCCESS, event: `${post._id} liked from ${user.id}` })
})
const addComment = asyncWrapper(async (req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post)
        return next(new AppError('This post is not exists', 400, Status.FAIL));

    const user = req.user;
    const { comment } = req.body;

    const newComment = new Comment({ postId: postId, content: comment, commenterId: user.id });
    post.commentsNumber++;

    await post.save();
    await newComment.save();
    return res.json({ NewComment: newComment });

})
const deleteComment = asyncWrapper(async (req, res, next) => {
    const user = req.user;
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (!comment)
        return next(new AppError('this comment is not exists', 400, Status.FAIL));
    const commenterId = comment.commenterId;

    if (user.id.toString() !== commenterId.toString())
        return next(new AppError('this comment is not for you', 400, Status.FAIL));

    await Comment.findByIdAndDelete(commentId);

    return res.json({ Status: Status.SUCCESS, data: null });

});
const getAllComments = asyncWrapper(async (req, res, next) => {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId })
    return res.json({ Status: Status.SUCCESS, Comments: comments });
})
const isLiked = asyncWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    const like = await Like.find({ postId, likerId: userId });
    if (like.length > 0)
        return res.json({ Status: Status.SUCCESS, liked: true });
    else
        return res.json({ Status: Status.SUCCESS, liked: false });


})

module.exports = { addPost, deletePost, updatePost, getAllPosts, addLike, addComment, deleteComment, getAllComments, isLiked }