const express = require('express')
const authCtrl = require('../controllers/auth.controller')

const router = express.Router()

router.route('/api/auth/signin')
  .post(authCtrl.signin)

module.exports = router