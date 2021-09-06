const express = require('express');
const { getPosts, addPost, deletePost, reactPost, addCommentPost, deleteComment,
  getVideo } = require('../controllers/post.controller');

const postRouter = express.Router();

postRouter.route('/')
  .get(getPosts)

postRouter.route('/:userId/post')
  .post(addPost)



postRouter.route('/:userId/post/:postId')
  .delete(deletePost)

postRouter.route('/:userId/interactive/:postId/reacts')
  .post(reactPost)


postRouter.route('/:userId/interactive/:postId/comments')
  .post(addCommentPost)

postRouter.route('/:userId/interactive/:postId/comments/:commentId')
  .delete(deleteComment)

postRouter.route('/:userId/videos/:videoId')
  .get(getVideo)

module.exports = postRouter;