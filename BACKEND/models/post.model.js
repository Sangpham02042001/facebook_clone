const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    status: {
        type: String,
        require: true
    },
    image: {
        type: String,
    },
    userId: {
        type: mongoose.Types.ObjectId
    },
    created: {
        type: Date,
        default: Date.now
    },
})

const Posts = mongoose.model('Post', postSchema);

module.exports = Posts