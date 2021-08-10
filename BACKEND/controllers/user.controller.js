const User = require('../models/user.model')

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

module.exports = {
  signup
}