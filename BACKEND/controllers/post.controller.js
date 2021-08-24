const Posts = require('../models/post.model')

const getPosts = (req, res, next) => {
    Posts.find({})
        .populate('user', 'name _id')
        .populate('reactList.user', 'name _id')
        .populate('comments.user', 'name _id')
        .sort("-createdAt")
        .then((posts) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
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
        Posts.create({ article: req.body.article, user: req.body.userId, image: { data: imageBase64, contentType: imageType } })
            .then((post) => {
                console.log('post: ', post);
                Posts.findById(post._id)
                    .populate('user', 'name _id')
                    .then(post => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(post);
                    })

            }, (err) => next(err))
            .catch((err) => next(err));
    } else {
        res.statusCode = 403;
        res.end('Could not post!');
    }

}

const deletePost = (req, res, next) => {
    Posts.findById(req.params.postId)
        .then(post => {
            if (!post) {
                let err = new Error('Could not find this post');
                err.status = 403;
                return next(err);
            }
            if (post.user == req.params.userId) {
                Posts.findByIdAndRemove(req.params.postId)
                    .then((resp) => {
                        console.log(resp);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            } else {
                let err = new Error('You are not authorized to delete this comment');
                err.status = 403;
                return next(err);
            }
        }).catch(err => next(err))

}

const reactPost = async (req, res, next) => {
    let reactType = req.body.reactType;
    let userId = req.body.userId;
    try {
        let post = await Posts.findById(req.body.postId);
        if (!post) {
            let err = new Error('Could not find this post');
            err.status = 403;
            return next(err);
        }
        let react = post.reactList.find(r => r.user == userId);
        if (!react) {
            post.reactList.push({ user: userId, reactType });
            await post.save();
        } else {
            if (!post.reactList.id(react._id)) {
                let err = new Error('Could not find this react');
                err.status = 403;
                return next(err);
            }
            if (reactType == react.reactType) {
                post.reactList.id(react._id).remove();
                await post.save();
            } else {
                post.reactList.id(react._id).reactType = reactType;
                await post.save();
            }
        }
        Posts.findById(post._id)
            .populate('reactList.user', '_id name')
            .populate('comments.user', '_id name')
            .then(post => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                console.log(post);
                res.json(post);
            })
    } catch (error) {
        return next(error);
    }

}

const addCommentPost = async (req, res, next) => {
    try {
        console.log(req.body)
        const post = await Posts.findById(req.body.postId);
        if (!post) {
            let err = new Error('Could not find this post');
            err.status = 403;
            return next(err);
        }
        post.comments.unshift({ comment: req.body.comment, user: req.body.userId });
        await post.save();
        Posts.findById(post._id)
            .populate('reactList.user', '_id name')
            .populate('comments.user', '_id name')
            .then(post => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                console.log(post);
                res.json(post);
            })
    } catch (error) {
        return next(error);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.postId);
        if (!post) {
            let err = new Error('Could not find this post');
            err.status = 403;
            return next(err);
        }
        if (!post.comments.id(req.params.commentId)) {
            let err = new Error('Could not find this commnent');
            err.status = 403;
            return next(err);
        }
        post.comments.id(req.params.commentId).remove();
        await post.save();
        Posts.findById(post._id)
            .populate('reactList.user', '_id name')
            .populate('comments.user', '_id name')
            .then(post => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                console.log(post);
                res.json(post);
            })


    } catch (err) {
        return next(err)
    }

}


module.exports = { getPosts, addPost, deletePost, reactPost, addCommentPost, deleteComment }