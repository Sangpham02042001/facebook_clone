const express = require('express')
const groupRouter = express.Router()
const { requireSignin } = require('../controllers/auth.controller')
const { createGroup, getGroupById, getCoverPhoto,
  getAllGroup, getGroupsManagedByUser, getGroupsJoinedByUser } = require('../controllers/group.controller')

groupRouter.route('/api/groups')
  .post(requireSignin, createGroup)
  .get(requireSignin, getAllGroup)

groupRouter.route('/api/groups/managebyuser')
  .get(requireSignin, getGroupsManagedByUser)

groupRouter.route('/api/groups/joinedbyuser')
  .get(requireSignin, getGroupsJoinedByUser)

groupRouter.route('/api/groups/:groupId')
  .get(requireSignin, getGroupById)

groupRouter.route('/api/group/coverphoto/:groupId')
  .get(getCoverPhoto)

module.exports = groupRouter