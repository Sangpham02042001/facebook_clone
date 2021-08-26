const Conversation = require('../models/conversation.model')

const getConversation = async (req, res) => {
  let { conversationId } = req.params
  try {
    let conversation = await Conversation.findById(conversationId)
    if (conversation) {
      return res.status(200).json({ conversation })
    } else {
      return {
        message: "Haven't been created yet"
      }
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const getConversationList = async (req, res) => {
  let { userId } = req.params
  try {
    let conversations = await Conversation
      .find({})
      .populate('participants', '_id name')
    conversations = conversations.filter(cv => {
      return cv.participants.indexOf(userId) >= 0
    })
    conversations = conversations.map(cv => ({
      _id: cv._id,
      participant: cv.participants.filter(user => user._id !== userId)[0]
    }))
    return res.status(200).json({ conversations })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

module.exports = {
  getConversation,
  getConversationList
}