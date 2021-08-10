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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
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