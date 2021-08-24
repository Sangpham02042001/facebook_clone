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

  socket.on('user-disconnect', ({ userID }) => {
    let idx = onlineUserList.indexOf(userID)
    console.log('server on user disconnected')
    onlineUserList.splice(idx, 1)
    console.log('new online user list', onlineUserList)
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