const express = require('express')
const { signup } = require('../controllers/user.controller')

const router = express.Router()

router.route('/api/users')
  .post(signup)

module.exports = router