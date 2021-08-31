const express = require('express');
const { getPosts, addPost, deletePost, reactPost, addCommentPost, deleteComment, addVideo, getVideo, addVideo2 } = require('../controllers/post.controller');
const multer = require('multer');
const path = require('path')

const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');


const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const uploadVideo = multer({ storage });
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


postRouter.route('/:userId/videos')
  .get(getVideo)
  // .post(uploadVideo.single('video-post'), addVideo)
  .post(addVideo2)

module.exports = postRouter;