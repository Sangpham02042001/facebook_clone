const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    article: {
        type: String,
        require: true
    },
    image: {
        data: String,
        contentType: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
})

const Posts = mongoose.model('Post', postSchema);

module.exports = Posts