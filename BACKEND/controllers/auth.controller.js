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

    console.log(user)

    res.status(200).json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio
    })

  } catch (err) {
    return res.status(400).json({
      error: 'Something wrong'
    })
  }
}

module.exports = {
  signin
}