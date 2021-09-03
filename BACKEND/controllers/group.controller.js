const Group = require('../models/group.model')
const formidable = require('formidable')
const fs = require('fs')

const createGroup = async (req, res) => {
  const form = formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    let userId = req.auth._id
    let { name, isPublic } = fields
    let { coverPhoto } = files
    let group = new Group()
    group.name = name
    group.isPublic = isPublic || true
    group.coverPhoto = {
      data: fs.readFileSync(coverPhoto.path),
      contentType: coverPhoto.type
    }
    group.admins = [{ _id: userId }]
    group.members = [{ _id: userId }]
    try {
      await group.save()
      group.coverPhoto = undefined
      return res.status(200).json({ group })
    } catch (error) {
      return res.status(400).json({ error })
    }
  })
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

module.exports = { createGroup, getCoverPhoto }