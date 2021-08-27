import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MessageBox from './MessageBox'
import { receviceMessage, newConversation } from '../../store/reducers/conversation.reducer'
import socketClient from '../../socketClient'
import styles from './MessageBoxs.module.scss'

export default function MessageBoxs() {
  const conversations = useSelector(state => state.conversationReducer.conversations)
  const dispatch = useDispatch()
  useEffect(() => {
    socketClient.on('receive-private-message', ({ content, from, conversationId }) => {
      dispatch(receviceMessage({
        newMessage: content,
        sender: from,
        conversationId
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
