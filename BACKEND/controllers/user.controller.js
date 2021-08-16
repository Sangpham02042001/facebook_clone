const User = require('../models/user.model')
const fs = require('fs')
const formidable = require('formidable')
const extend = require('lodash/extend')

const listUser = async (req, res) => {
  try {
    let users = await User.find({}).select('_id')
    users = users.map(user => user._id)
    return res.status(200).json({ userList: users })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

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

const updateProfile = (req, res) => {
  console.log('inside update profile')
  const form = formidable.IncomingForm()
  form.keepExtensions = true
  console.log(form)
  form.parse(req, async (err, fields, files) => {
    console.log(fields, files)
    if (err) {
      return res.status(400).json({
        error: 'Something wrong'
      })
    }
    let userId = req.auth._id
    try {
      let user = await User.findById(userId)
      user = extend(user, fields)
      if (files.avatar) {
        user.avatar.data = fs.readFileSync(files.avatar.path)
        user.avatar.contentType = files.avatar.type
      }
      if (files.coverPhoto) {
        user.coverPhoto.data = fs.readFileSync(files.coverPhoto.path)
        user.coverPhoto.contentType = files.coverPhoto.type
      }
      await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      user.avatar = undefined
      user.coverPhoto = undefined
      return res.status(200).json(user)
    } catch (error) {
      console.log(error)
    }
  })
}

const userProfile = async (req, res) => {
  console.log(req.params.userId)
  try {
    let user = await User.findById(req.params.userId)
    return res.status(200).json({
      user
    })
  } catch (error) {
    console.log(error)
    return res.status('400').json({
      error: 'Something wrong when get user'
    })
  }
}

const addFriend = async (req, res) => {
  console.log('add friend', req.params.userId)
  console.log('add friend', req.body)
  try {
    let user = req.user
    console.log(user)
    let userAddedId = req.body.userIdAdded
    user.followings.push(userAddedId)
    let userAdded = await User.findById(userAddedId)
    if (userAdded) {
      userAdded.followers.push(user._id)
    }
    await user.save()
    await userAdded.save()
    return res.status(200).json({
      message: "Add friend success"
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error: 'Something wrong, try again'
    })
  }
}

const comfirmFriendRequest = async (req, res) => {

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
  userByID,
  listUser,
  updateProfile,
  userProfile,
  addFriend,
  comfirmFriendRequest
}