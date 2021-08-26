const Conversation = require('../models/conversation.model')

const getConversation = async (req, res) => {
  let { conversationId } = req.params
  try {
    let conversation = await Conversation.findById(conversationId)
      .populate('participants', '_id name')
    if (conversation) {
      return res.status(200).json({
        conversation
      })
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
      .find({ })
      .populate('participants', '_id name')
    conversations = conversations.filter(cv => {
      return cv.participants.map(p => p._id).indexOf(userId) >= 0
    })
    console.log(userId, 'userId')
    console.log('conversations 1', conversations)
    conversations = conversations.map(cv => ({
      _id: cv._id,
      participant: cv.participants.filter(p => p._id != userId)[0]
    }))
    console.log('conversations 2', conversations)
    return res.status(200).json({ conversations })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const postNewMessage = async (req, res, next) => {
  try {
    const { senderId, content, conversationId, _id } = req.body;
    let newConversation = { messages: [{ sender: senderId, content, _id }], participants: [senderId, conversationId] }
    newConversation = await Conversation.create(newConversation);

    return res.status(200).json(newConversation);

  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getConversation,
  getConversationList,
  postNewMessage
}