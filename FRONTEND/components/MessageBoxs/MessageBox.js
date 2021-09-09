import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { Avatar, Input, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import styles from './MessageBoxs.module.scss'
import { baseURL } from '../../utils'
import socketClient from '../../socketClient'
import {
  closeConversation, sendMessageSocket
} from '../../store/reducers/conversation.reducer'
import { v4 } from 'uuid';
import { Row, Col } from 'antd';

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
  const messageEnd = useRef()

  useEffect(() => {
    messageEnd.current.scrollIntoView({ behavior: "smooth" })
  }, [])


  const handleClose = (event) => {
    event.preventDefault();
    dispatch(closeConversation({
      _id
    }))
  }

  const handleVideoCall = (event) => {
    event.preventDefault();
    window.open('http://192.168.1.15:3000/videocall/incall/' + _id, '_blank').focus();
  }

  const handleSendMessage = event => {
    if (newMessage) {
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

      <Row className={styles.messageHeader}>
        <Col span={10} className={styles["tagNameMessageHeader"]}>
          <Link style={{ marginBottom: 0 }}
            href={`/profile/${participant._id}`}>
            <a style={{ display: 'flex' }}>
              <Avatar src={`${baseURL}/api/user/avatar/${participant._id}`}
                style={{ marginRight: '10px' }}
              />
              <span style={{ color: '#050505', fontWeight: '400', fontSize: '18px' }}>
                {participant.name}
                {/* {participant.activityStatus === 'online' ?
                <div className={`${styles['userStatus']} ${styles['online']}`}></div>
                : <div className={`${styles['userStatus']} ${styles['offline']}`}></div>} */}
              </span>
            </a>
          </Link>
        </Col>
        <Col offset={8} span={2} className={styles["iconMessageHeader"]}>
          <Tooltip title="start a voice call" placement="top">
            <i style={{ cursor: 'pointer' }}
              onClick={handleVideoCall}
              className="fas fa-phone">
            </i>
          </Tooltip>
        </Col>
        <Col offset={2} span={2} className={styles["iconMessageHeader"]}>

          <Tooltip title="close" placement="top">
            <i style={{ cursor: 'pointer' }}
              onClick={handleClose}
              className="fas fa-times">
            </i>
          </Tooltip>
        </Col>
      </Row>



      <div className={styles.messageList} ref={messageEnd}>
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
