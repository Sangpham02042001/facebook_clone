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
      .find({})
      .populate('participants', '_id name')
    conversations = conversations.filter(cv => {
      return cv.participants.map(p => p._id).indexOf(userId) >= 0
    })
    conversations = conversations.map(cv => ({
      _id: cv._id,
      participant: cv.participants.filter(p => p._id != userId)[0]
    }))
    return res.status(200).json({ conversations })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}

const postNewMessage = async (req, res, next) => {
  try {
    const { senderId, content, conversationId, messageId } = req.body;
    let newConversation = { messages: [{ sender: senderId, content, _id: messageId }], participants: [senderId, conversationId] }
    newConversation = await Conversation.create(newConversation);

    return res.status(200).json(newConversation);

  } catch (error) {
    return next(error)
  }
}

const postMessage = async (req, res, next) => {
  try {
    const { senderId, content, conversationId, messageId } = req.body;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      let err = new Error('Could not find this conversation');
      err.status = 403;
      return next(err);
    }

    conversation.messages.push({ sender: senderId, content, _id: messageId });
    await conversation.save();

    return res.status(200).json(conversation);

  } catch (error) {
    return next(error)
  }
}

const getConversationId = async ( senderId, content, conversationId, messageId ) => {
  try {
    console.log('aaaaaaaaaaaaaaaaaaaaaa', conversationId)
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      let newConversation = { messages: [{ sender: senderId, content, _id: messageId }], participants: [senderId, conversationId] }
      newConversation = await Conversation.create(newConversation);

      return newConversation;
    }

    conversation.messages.push({ sender: senderId, content, _id: messageId });
    await conversation.save();

    return conversation;

  } catch (error) {
    console.log(error)
    return null;
  }
}



module.exports = {
  getConversation,
  getConversationList,
  postNewMessage,
  postMessage,
  getConversationId,
}