import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MessageBox from './MessageBox'
import { receiveMessage, checkMessageSocket } from '../../store/reducers/conversation.reducer'
import socketClient from '../../socketClient'
import styles from './MessageBoxs.module.scss'

export default function MessageBoxs() {
  const conversations = useSelector(state => state.conversationReducer.conversations)
  const dispatch = useDispatch()
  useEffect(() => {

    socketClient.on("check-conversation-id", ({ conversationId, participantId }) => {
      dispatch(checkMessageSocket({
        conversationId,
        receiveId: participantId
      }))
    })

    socketClient.on('sent-private-message', ({ content, from, to, conversationId, messageId }) => {
      console.log('sent-private-message')
      dispatch(receiveMessage({
        newMessage: content,
        sender: from,
        receiveId: to,
        conversationId,
        messageId
      }))

      socketClient.emit('receive-private-message',
        { content, from, to, conversationId, messageId })

    })

    socketClient.on('received-private-message', ({ content, from, to, conversationId, messageId }) => {
      console.log('received-private-message')
      dispatch(checkMessageSocket({
        newMessage: content,
        sender: from,
        receiveId: to,
        conversationId,
        messageId,
      }))
    })
  }, [])
  return (
    <div className={styles.messageBoxs}>
      {
        conversations.filter(cv => cv.visible === true)
          .map(cv => (
            <MessageBox key={cv._id} conversation={cv} />
          ))
      }
    </div>
  )
}
