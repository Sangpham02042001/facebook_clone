const express = require('express');
const { getPosts, addPost } = require('../controllers/post.controller');
const postRouter = express.Router();

postRouter.route('/')
    .get(getPosts)
    .post(addPost)


module.exports = postRouter;