const Posts = require('../models/post.model')
const fs = require('fs');

const getPosts = (req, res, next) => {
    Posts.find({})
        .populate('userId', 'name _id')
        .sort("-created")
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

    if (req.body.article || imageBase64) {
        Posts.create({ article: req.body.article, userId: req.body.userId, image: { data: imageBase64, contentType: imageType } })
            .then((post) => {
                console.log('post: ', post);
                Posts.find(post)
                    .populate('userId', 'name _id')
                    .then(p => {
                        console.log(p);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(...p);
                    })

            }, (err) => next(err))
            .catch((err) => next(err));
    } else {
        res.statusCode = 403;
        res.end('Could not post!');
    }

}

const deletePost = (req, res, next) => {
    let id = req.params.postId;
    // Posts.findByIdAndRemove(id)
    //     .then((resp) => {
    //         res.statusCode = 200;
    //         res.setHeader('Content-Type', 'application/json');
    //         res.json(resp);
    //     }, (err) => next(err))
    //     .catch((err) => next(err));
}


module.exports = { getPosts, addPost, deletePost }