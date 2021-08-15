const Posts = require('../models/post.model')
const fs = require('fs');

const getPosts = (req, res, next) => {
    Posts.find({}).sort("-created")
        .then(posts => {
            res.statusCode = 200;
            res.json(posts);
        }).catch(err => {
            next(err);
        })
}


const addPost = (req, res, next) => {
    // console.log(req.file);
    let fileImage = req.file;
    let imageType = fileImage && fileImage.mimetype;
    let imageBase64 = fileImage && fileImage.buffer.toString('base64');
    let data = JSON.parse(req.query.metaData);

    if (data.article || imageBase64) {
        Posts.create({ article: data.article, userId: data.userId, image: { data: imageBase64, contentType: imageType } })
            .then((post) => {
                // console.log('post: ', post);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            }, (err) => next(err))
            .catch((err) => next(err));
    } else {
        res.statusCode = 403;
        res.end('Could not post!');
    }

}


module.exports = { getPosts, addPost }