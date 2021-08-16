const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      "email": req.body.email
    })
    if (!user) {
      return res.status(400).json({
        error: `User with email ${req.body.email} not found`
      })
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(400).json({
        error: `Wrong password with email ${req.body.email}`
      })
    }

    const token = jwt.sign({
      _id: user._id,
      name: user.name
    }, process.env.JWT_SECRET_KEY)

    res.status(200).json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      friends: user.friends,
      followings: user.followings,
      followers: user.followers
    })

  } catch (err) {
    return res.status(400).json({
      error: 'Something wrong'
    })
  }
}

const requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (user) {
      req.auth = user
      console.log('require sign in', user)
      next()
    }
  }
}

const hasAuthorization = (req, res, next) => {
  console.log(req.user)
  const authorized = req.user && req.auth && req.user._id == req.auth._id
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized"
    })
  }
  next()
}

module.exports = {
  signin, requireSignin,
  hasAuthorization
}