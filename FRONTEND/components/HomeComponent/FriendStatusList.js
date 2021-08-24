import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AvatarProfile from '../AvatarProfile'
import socket from '../../socketClient'
import { onFriendOnline, onFriendOffline } from '../../store/reducers/user.reducer'

export default function FriendStatusList() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.userReducer.user)
  useEffect(() => {
    socket.on("user-connected", ({ onlineUserList }) => {
      console.log('ccsdaasfdsfas', onlineUserList)
      dispatch(onFriendOnline({
        onlineUserList: onlineUserList
      }))
    })

    socket.on("online-users", ({ onlineUserList, receiverId }) => {
      if (user._id === receiverId) {
        // let idx = onlineUserList.indexOf(receiverId)
        console.log('online user list', onlineUserList)
        dispatch(onFriendOnline({
          onlineUserList: onlineUserList
        }))
      }
    })

    socket.on('user-disconnected', ({ userID }) => {
      dispatch(onFriendOffline({
        userID
      }))
    })

    return () => {
      console.log('component did unmounted')
      socket.emit('user-disconnect', { userID: user._id })

      // socket.off('user-disconnect')
      // socket.off('user-disconnected')
      // socket.off('user-connected')
      // socket.off('online-users')
    }
  }, [])

  return (
    <div>
      {user.friends && user.friends.map(user => (
        <div key={user._id}>
          <AvatarProfile showName={true} user={user} />
          <span>{user.activityStatus}</span>
        </div>
      ))}
    </div>
  )
}
