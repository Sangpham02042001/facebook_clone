const express = require('express')
const { getConversation, getConversationList } = require('../controllers/conversation.controller')
const router = express.Router()

router.route('/api/conversations/:conversationId')
  .get(getConversation)

router.route('/api/:userId/conversations')
  .get(getConversationList)

module.exports = router