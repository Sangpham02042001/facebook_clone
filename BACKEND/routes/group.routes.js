const express = require('express')
const groupRouter = express.Router()
const { requireSignin } = require('../controllers/auth.controller')
const { createGroup, getCoverPhoto } = require('../controllers/group.controller')

groupRouter.route('/api/groups')
  .post(requireSignin, createGroup)

groupRouter.route('/api/group/coverphoto/:groupId')
  .get(getCoverPhoto)

module.exports = groupRouter