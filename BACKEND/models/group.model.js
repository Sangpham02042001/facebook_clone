const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let postSchema = new Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post'
  },
  topicId: {
    type: String,
    require: true
  },
  groupId: {
    type: mongoose.Types.ObjectId,
    ref: 'Group'
  }
})

let memberSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
}, {
  timestamps: true
})

let groupSchema = new Schema({
  isPublic: {
    type: Boolean,
    default: true
  },
  coverPhoto: {
    data: Buffer,
    contentType: String
  },
  name: {
    type: String,
    require: true
  },
  members: [memberSchema],
  request_members: [memberSchema],
  admins: [memberSchema],
  posts: [postSchema],
  about: {
    type: String,
    require: true
  },
  topics: [{
    _id: String,
    content: String,
  }],
}, {
  timestamps: true
})

module.exports = mongoose.model('Group', groupSchema)