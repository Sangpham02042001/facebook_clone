const express = require('express');
const { getPosts, addPost, deletePost } = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer();

const postRouter = express.Router();

postRouter.route('/')
    .get(getPosts)
    
postRouter.route('/:userId')
    .post(upload.single('image-post'), addPost)

postRouter.route('/:userId/:postId')
    .delete(deletePost)

module.exports = postRouter;