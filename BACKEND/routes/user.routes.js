const express = require('express')
const { signup, getAvatar, getDefaultAvatar,
  userByID, getCoverPhoto, getDefaultCoverPhoto } = require('../controllers/user.controller')

const router = express.Router()

router.route('/api/users')
  .post(signup)

router.route('/api/user/photo/:userId')
  .get(getAvatar, getDefaultAvatar)

router.route('/api/user/coverphoto/:userId')
  .get(getCoverPhoto, getDefaultCoverPhoto)

router.param('userId', userByID)

module.exports = router