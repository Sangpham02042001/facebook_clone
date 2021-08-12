
const Posts = require('../models/post.model')

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
    if (req.body.status && req.body.status != "") {
        Posts.create({ status: req.body.status, userId: req.body.userId })
            .then((post) => {
                console.log(req.body);
                console.log('post: ', post);
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