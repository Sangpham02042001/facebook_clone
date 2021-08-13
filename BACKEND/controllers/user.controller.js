const User = require('../models/user.model')
const fs = require('fs')

const signup = async (req, res) => {
  const user = new User(req.body)
  console.log(user)
  try {
    await user.save()
    return res.status(201).json({
      message: 'Successfully signed up'
    })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const getAvatar = async (req, res, next) => {
  if (req.user.avatar.contentType) {
    res.set('Content-Type', req.user.avatar.contentType)
    return res.send(req.user.avatar.data)
  }
  next()
}

const getCoverPhoto = async (req, res, next) => {
  if (req.user.coverPhoto.contentType) {
    res.set('Content-Type', req.user.coverPhoto.contentType)
    return res.send(req.user.coverPhoto.data)
  }
  next()
}

const getDefaultAvatar = async (req, res) => {
  const readStream = fs.createReadStream('./public/images/default_avt.jpg')
  readStream.pipe(res)
}

const getDefaultCoverPhoto = async (req, res) => {
  const readStream = fs.createReadStream('./public/images/default-cover-photo.png')
  readStream.pipe(res)
}

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    if (!user) {
      return res.status(400).json({
        error: 'User not found'
      })
    }
    req.user = user
    next()
  } catch (error) {
    console.log(error)
    return res.status('400').json({
      error: 'Something wrong when get user'
    })
  }
}

module.exports = {
  signup,
  getAvatar,
  getDefaultAvatar,
  getCoverPhoto,
  getDefaultCoverPhoto,
  userByID
}