const Posts = require('../models/post.model')
// const Videos = require('../models/videos.gridfs.model')
const mongoose = require('mongoose');
const fs = require('fs')
const mongodb = require('mongodb')
const Grid = require('gridfs-stream');

const getPosts = (req, res, next) => {
    Posts.find({ })
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



const addVideo = (req, res, next) => {
    console.log(res);
    return res.status(200).json("ok")
}

const addVideo2 = (req, res) => {
    mongodb.MongoClient.connect(process.env.MONGO_URI, function (error, client) {
        if (error) {
            res.json(error);
            return;
        }
        const db = client.db('myFirstDatabase');
        const bucket = new mongodb.GridFSBucket(db);
        const videoUploadStream = bucket.openUploadStream('cong-son');
        const videoReadStream = fs.createReadStream('./cong-son.mp4');
        videoReadStream.pipe(videoUploadStream);
        res.status(200).send("Done...");
    });
};

const getVideo = (req, res, next) => {
    mongodb.MongoClient.connect(process.env.MONGO_URI,
        function (error, client) {
            if (error) {
                console.log(error)
                res.status(500).json(error);
                return;
            }

            const range = req.headers.range;
            if (!range) {
                res.status(400).send("Requires Range header");
            }

            const db = client.db('myFirstDatabase');
            // GridFS Collection
            db.collection('fs.files').findOne({ }, (err, video) => {
                if (!video) {
                    res.status(404).send("No video uploaded!");
                    return;
                }

                // Create response headers
                const videoSize = video.length;
                console.log(videoSize, 'videoSize')
                // const start = 0;
                const start = Number(range.replace(/\D/g, ""));
                const end = Number(videoSize - 1);
                console.log('start', start, 'end', end)

                const contentLength = end - start + 1;
                const headers = {
                    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": contentLength,
                    "Content-Type": "video/mp4",
                };

                // HTTP Status 206 for Partial Content
                res.writeHead(206, headers);

                const bucket = new mongodb.GridFSBucket(db);
                const downloadStream = bucket.openDownloadStreamByName(video.filename, {
                    start
                });

                // Finally pipe video to response
                downloadStream.pipe(res);
            });
        });
}


// Videos.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//         res.status(403).json("false")
//     } else {
//         files.map(file => {
//             if (
//                 file.contentType === 'video/mp4' ||
//                 file.contentType === 'video/webm '
//             ) {
//                 file.isVideo = true;
//             } else {
//                 file.isVideo = false;
//             }
//         });

//         res.status(200).json("imok");
//     }
// })



const addPost = async (req, res, next) => {
    // console.log(req.file);
    let fileImage = req.file;
    let imageType = fileImage && fileImage.mimetype;
    let imageBase64 = fileImage && fileImage.buffer.toString('base64');

    if (req.body.article || imageBase64) {
        try {
            const post = await Posts.create({ article: req.body.article, user: req.body.userId, image: { data: imageBase64, contentType: imageType } })
            Posts.findById(post._id)
                .populate('user', 'name _id')
                .then(post => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);
                })
        } catch (error) {
            return next(error);
        }
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
                        // console.log(resp);
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
                // console.log(post);
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
                // console.log(post);
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
                // console.log(post);
                res.json(post);
            })


    } catch (err) {
        return next(err)
    }
}




module.exports = { getPosts, addPost, deletePost, reactPost, addCommentPost, deleteComment, addVideo2, addVideo, getVideo }