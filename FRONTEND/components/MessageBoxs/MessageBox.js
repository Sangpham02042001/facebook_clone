import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { Avatar, Input, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import styles from './MessageBoxs.module.scss'
import { baseURL } from '../../utils'
import socketClient from '../../socketClient'
import {
  closeConversation,
  sendMessageSocket
} from '../../store/reducers/conversation.reducer'
import { v4 } from 'uuid'

const getTime = (time) => {
  let hours = new Date(time).getHours().toString()
  if (hours.length < 2) {
    hours = '0' + hours
  }
  let minutes = new Date(time).getMinutes().toString()
  if (minutes.length < 2) {
    minutes = '0' + minutes
  }
  return hours + ":" + minutes
}

export default function MessageBox({ conversation: {
  participant,
  _id,
  messages
} }) {
  const userLogin = useSelector(state => state.userReducer.user)
  const [newMessage, setNewMessage] = useState('')
  const dispatch = useDispatch()

  const handleClose = (event) => {
    event.preventDefault()
    dispatch(closeConversation({
      _id
    }))
  }

  const handleSendMessage = event => {
    if (newMessage) {
      // if (messages.length) {
      //   dispatch(sendMessage({ content: newMessage, conversationId: _id, senderId: userLogin._id }));
      // } else {
      //   dispatch(sendNewMessage({ content: newMessage, conversationId: _id, senderId: userLogin._id }));
      // }
      console.log(_id)
      let messageId = v4()
      socketClient.emit('send-private-message', {
        content: newMessage,
        from: userLogin._id,
        to: participant._id,
        conversationId: _id,
        messageId: messageId,
      })

      dispatch(sendMessageSocket({
        newMessage: newMessage,
        sender: userLogin._id,
        receiveId: participant._id,
        conversationId: _id,
        messageId: messageId,
      }))

      setNewMessage('')

    }
  }

  return (
    <div className={styles.messageFrame}>
      <div className={styles.messageHeader}>
        <Link style={{ marginBottom: 0 }}
          href={`/profile/${participant._id}`}>
          <a style={{ display: 'flex' }}>
            <Avatar src={`${baseURL}/api/user/avatar/${participant._id}`}
              style={{ marginRight: '10px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {participant.name}
              {/* {participant.activityStatus === 'online' ?
                <div className={`${styles['userStatus']} ${styles['online']}`}></div>
                : <div className={`${styles['userStatus']} ${styles['offline']}`}></div>} */}
            </div>
          </a>
        </Link>
        <i style={{ cursor: 'pointer', padding: '10px' }}
          onClick={handleClose}
          className="fas fa-times"></i>
      </div>

      <div className={styles.messageList}>
        {
          messages.map((message, idx) => (
            <div key={message._id}
              className={message.sender == userLogin._id ?
                `${styles.messageLine} ${styles.myMessageLine}`
                : `${styles.messageLine} ${styles.yourMessageLine}`}>
              {message.sender !== userLogin._id
                && ((idx < messages.length - 2 && message.sender !== messages[idx + 1].sender)
                  || idx === messages.length - 1)
                && <Avatar src={`${baseURL}/api/user/avatar/${message.sender}`} />}
              <Tooltip
                title={getTime(message.sendAt)}
                className={message.sender == userLogin._id ?
                  `${styles.message} ${styles.myMessage}`
                  : `${styles.message} ${styles.yourMessage}`}>
                {message.content}
              </Tooltip>
            </div>
          ))
        }
      </div>

      <div className={styles.messageInput}>
        <Input
          placeholder="Send message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onPressEnter={handleSendMessage}
          suffix={<i className="fas fa-arrow-right"></i>} />
      </div>
    </div>
  )
}
