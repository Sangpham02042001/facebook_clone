const express = require('express')
const groupRouter = express.Router()
const { requireSignin } = require('../controllers/auth.controller')
const { createGroup, getGroupById, getCoverPhoto, getAllGroup } = require('../controllers/group.controller')

groupRouter.route('/api/groups')
  .post(requireSignin, createGroup)
  .get(requireSignin, getAllGroup)

groupRouter.route('/api/groups/:groupId')
  .get(requireSignin, getGroupById)

groupRouter.route('/api/group/coverphoto/:groupId')
  .get(getCoverPhoto)

module.exports = groupRouter