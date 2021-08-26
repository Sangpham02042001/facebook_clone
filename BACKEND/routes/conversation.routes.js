const express = require('express')
const { getConversation, getConversationList, postNewMessage } = require('../controllers/conversation.controller')
const router = express.Router()

router.route('/api/conversations/:conversationId')
  .get(getConversation)


router.route('/api/:userId/conversations')
  .get(getConversationList)
  .post(postNewMessage)


module.exports = router