const express = require('express');
const { getPosts, addPost, deletePost, reactPost, addCommentPost, deleteComment,
  getVideo, getImage } = require('../controllers/post.controller');

const postRouter = express.Router();

postRouter.route('/posts')
  .get(getPosts)

postRouter.route('/posts/:userId/post')
  .post(addPost)



postRouter.route('/posts/:userId/post/:postId')
  .delete(deletePost)

postRouter.route('/posts/:userId/interactive/:postId/reacts')
  .post(reactPost)


postRouter.route('/posts/:userId/interactive/:postId/comments')
  .post(addCommentPost)

postRouter.route('/posts/:userId/interactive/:postId/comments/:commentId')
  .delete(deleteComment)

postRouter.route('/:userId/videos/:videoId')
  .get(getVideo)

postRouter.route('/:userId/post/:postId/photos/:imageId/')
  .get(getImage)
module.exports = postRouter;