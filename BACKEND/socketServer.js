const { saveConversation } = require('./controllers/conversation.controller')

let onlineUserList = []

const SocketServer = (socket) => {
  let idx = onlineUserList.indexOf(socket.userID)
  if (idx < 0) {
    onlineUserList.push(socket.userID)
    console.log('online user list', onlineUserList)
  }

  socket.broadcast.emit("user-connected", {
    onlineUserList: [socket.userID],
  });

  socket.emit('online-users', {
    onlineUserList: onlineUserList,
    receiverId: socket.userID
  })

  socket.on("check-conversations", ({ conversations }) => {
    for (const cv of conversations) {
      socket.to(cv.participant._id).emit("check-conversation-id", {
        conversationId: cv._id,
        participantId: socket.id
      })
    }
  })

  socket.on('send-private-message', async ({ content, from, to, conversationId, messageId }) => {
    console.log('content - to - from', content, to, from, socket.id, socket.userID)
    console.log('xxxxxxxx', conversationId)
    const conversation = await saveConversation(socket.userID, content, conversationId, messageId);

    socket.to(to).emit('sent-private-message', {
      content,
      from: socket.userID,
      to,
      conversationId: conversation._id,
      messageId,

    })

  })

  socket.on('receive-private-message', async ({ content, from, to, conversationId, messageId }) => {

    console.log('content - to - from - socketId - socketUserId', content, to, from, socket.id, socket.userID)

    socket.to(from).emit('received-private-message', {
      content,
      from,
      to,
      conversationId,
      messageId,
    })
  })

  //message
  socket.on("user-call", ({from, to, signalData}) => {
    console.log(to, socket.id)
    socket.to(to).emit("hey", {from, signalData});
  })

  socket.on("accept-call", ({to, signalData}) => {
    console.log('accept call')
    socket.to(to).emit('accepted-call', {signalData});
  })


  //disconnect
  socket.on('user-disconnect', ({ userID }) => {
    socket.broadcast.emit('user-disconnected', { userID })
    socket.disconnect()
  })

  socket.on('disconnect', () => {
    let idx = onlineUserList.indexOf(socket.userID)
    if (idx >= 0) {
      console.log('userid', socket.userID)
      socket.broadcast.emit('user-disconnected', { userID: socket.userID })
      onlineUserList.splice(idx, 1)
      console.log('close stupid', onlineUserList)
    }
  })

}

module.exports = SocketServer;