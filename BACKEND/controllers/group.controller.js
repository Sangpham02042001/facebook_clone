const Group = require('../models/group.model')
const formidable = require('formidable')
const fs = require('fs')

const filterGroupInfo = (group) => {
  group.coverPhoto = undefined
  group.admins = undefined
  group.members = undefined
  group.request_members = undefined
  group.posts = undefined
  group.topics = undefined
  return group
}

const createGroup = async (req, res) => {
  const form = formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    let userId = req.auth._id
    let { name, isPublic } = fields
    let { coverPhoto } = files
    let group = new Group()
    group.name = name
    group.isPublic = isPublic
    group.coverPhoto = {
      data: fs.readFileSync(coverPhoto.path),
      contentType: coverPhoto.type
    }
    group.admins = [{ user: userId }]
    try {
      await group.save()
      group = filterGroupInfo(group)
      return res.status(200).json({ group })
    } catch (error) {
      return res.status(400).json({ error })
    }
  })
}

const getAllGroup = async (req, res) => {
  try {
    let groups = await Group.find({})
      .populate('members._id', 'name _id')
    groups = groups.map(group => {
      group.coverPhoto = undefined
      return group
    })
    return res.status(200).json({ groups })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const getGroupById = async (req, res) => {
  let { groupId } = req.params
  try {
    let group = await Group.findById(groupId)
      .populate('members.user', 'name _id')
      .populate('admins.user', 'name _id')
      .populate('request_members.user', 'name _id')
    group.coverPhoto = undefined
    let userId = req.auth._id
    // if (group.admins.map(user => user.user).indexOf(userId) < 0) {
    //   group.admins = undefined
    // }
    return res.status(200).json({ group })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const getGroupsManagedByUser = async (req, res) => {
  let userId = req.auth._id
  try {
    let groupsManage = await Group.find({
      admins: {
        $elemMatch: {
          user: userId
        }
      }
    })
    groupsManage = groupsManage.map(group => {
      return filterGroupInfo(group)
    })
    return res.status(200).json({
      groupsManage
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}

const getGroupsJoinedByUser = async (req, res) => {
  let userId = req.auth._id
  try {
    let groupsJoined = await Group.find({
      members: {
        $elemMatch: {
          user: userId
        }
      }
    })
    groupsJoined = groupsJoined.map(group => {
      return filterGroupInfo(group)
    })
    return res.status(200).json({
      groupsJoined
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}

const getGroupsNotJoinedByUser = async (req, res) => {
  let userId = req.auth._id
  try {
    let groupsNotJoined = await Group.find({
      'members.user._id': {
        $nin: [userId]
      },
      'admins.user._id': {
        $nin: [userId]
      }
    })
    groupsNotJoined = groupsNotJoined.map(group => {
      let numOfMembers = group.members.length
      group = filterGroupInfo(group)
      group.members = numOfMembers
      return group
    })
    return res.status(200).json({
      groupsNotJoined
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}

const requestJoinGroup = async (req, res) => {
  let { groupId } = req.params
  let userId = req.auth._id
  try {
    let group = await Group.findById(groupId)
    if (group) {
      group.request_members.push({ user: userId })
      await group.save()
      return res.status(200).json({ message: 'Request success' })
    }

  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}

const getCoverPhoto = async (req, res) => {
  let { groupId } = req.params
  try {
    const group = await Group.findById(groupId)
    if (!group) {
      return res.status(400).json({ message: "No group found" })
    }
    res.set('Content-Type', group.coverPhoto.type)
    res.send(group.coverPhoto.data)
  } catch (error) {
    return res.status(400).json({ error })
  }
}

module.exports = {
  createGroup, getGroupById, getAllGroup,
  getGroupsManagedByUser, getCoverPhoto,
  getGroupsJoinedByUser, getGroupsNotJoinedByUser,
  requestJoinGroup
}