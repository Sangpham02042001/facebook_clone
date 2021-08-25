import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MessageBox from './MessageBox'
import styles from './MessageBoxs.module.scss'

export default function MessageBoxs() {
  const conversations = useSelector(state => state.conversationReducer.conversations)
  return (
    <div className={styles.messageBoxs}>
      {
        conversations.filter(cv => cv.visible === true)
          .map(cv => (
            <MessageBox key={cv.participant} conversation={cv} />
          ))
      }
    </div>
  )
}
