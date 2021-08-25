import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AvatarProfile from '../AvatarProfile'
import socket from '../../socketClient'
import { onFriendOnline, onFriendOffline } from '../../store/reducers/user.reducer'
import { newConversation } from '../../store/reducers/conversation.reducer'
import styles from './home.module.scss';
import { Row, Col, Button } from 'antd'

export default function FriendStatusList() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.userReducer.user)
  const conversations = useSelector(state => state.conversationReducer.conversations)
  useEffect(() => {
    socket.on("user-connected", ({ onlineUserList }) => {
      console.log('ccsdaasfdsfas', onlineUserList)
      dispatch(onFriendOnline({
        onlineUserList: onlineUserList
      }))
    })

    socket.on("online-users", ({ onlineUserList, receiverId }) => {
      if (user._id === receiverId) {
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

  const handleNewConversation = userId => event => {
    event.preventDefault()
    let conversationId = userId + '-' + user._id + '-'
    dispatch(newConversation({
      conversationId,
      participants: [userId, user._id]
    }))
    console.log(userId, user._id)
  }

  return (
    <div className={styles["friend-list"]}>
      <h2>Contacts</h2>
      {user.friends && user.friends.map(user => (
        <Row className={styles["friend-style"]} key={user._id} >
          <Col span={24}>
            <span>
              <AvatarProfile showName={true} user={user} />
              <span>{user.activityStatus}</span>
              <button onClick={handleNewConversation(user._id)}>new con</button>
            </span>
          </Col>
        </Row>
      ))}
      <p>{JSON.stringify(conversations)}</p>
    </div>
  )
}
