const express = require('express');
const { getPosts, addPost, deletePost, reactPost, addCommentPost, deleteComment } = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer();

const postRouter = express.Router();

postRouter.route('/')
    .get(getPosts)

postRouter.route('/:userId/post')
    .post(upload.single('image-post'), addPost)

postRouter.route('/:userId/post/:postId')
    .delete(deletePost)

postRouter.route('/:userId/interactive/:postId/reacts')
    .post(reactPost)


postRouter.route('/:userId/interactive/:postId/comments')
    .post(addCommentPost)

postRouter.route('/:userId/interactive/:postId/comments/:commentId')
    .delete(deleteComment)

module.exports = postRouter;