const express = require('express')
const groupRouter = express.Router()
const { requireSignin } = require('../controllers/auth.controller')
const { createGroup, getGroupById, getCoverPhoto,
  getAllGroup, getGroupsManagedByUser, getGroupsJoinedByUser,
  getGroupsNotJoinedByUser, requestJoinGroup } = require('../controllers/group.controller')

groupRouter.route('/api/groups')
  .post(requireSignin, createGroup)
  .get(requireSignin, getAllGroup)

groupRouter.route('/api/groups/managebyuser')
  .get(requireSignin, getGroupsManagedByUser)

groupRouter.route('/api/groups/joinedbyuser')
  .get(requireSignin, getGroupsJoinedByUser)

groupRouter.route('/api/groups/notjoinedbyuser')
  .get(requireSignin, getGroupsNotJoinedByUser)

groupRouter.route('/api/groups/:groupId')
  .get(requireSignin, getGroupById)

groupRouter.route('/api/group/coverphoto/:groupId')
  .get(getCoverPhoto)

groupRouter.route('/api/group/:groupId/join')
  .post(requireSignin, requestJoinGroup)

module.exports = groupRouter