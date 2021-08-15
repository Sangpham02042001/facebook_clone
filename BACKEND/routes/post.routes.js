const express = require('express');
const { getPosts, addPost } = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer();

const postRouter = express.Router();

postRouter.route('/')
    .get(getPosts)
    .post(upload.single('image-post'), addPost)


module.exports = postRouter;