import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { Avatar } from 'antd'
import { useSelector } from 'react-redux'
import styles from './MessageBoxs.module.scss'
import { baseURL } from '../../utils'

export default function MessageBox({ conversation: {
  participant,
  _id
} }) {
  const userLogin = useSelector(state => state.userReducer.user)
  const dispatch = useDispatch()

  const participantInfo = useMemo(() => {
    console.log('calculate repeat')
    return userLogin.friends[userLogin.friends.map(fr => fr._id).indexOf(participant)]
  }, [participant])

  const handleClose = (event) => {
    event.preventDefault()
    dispatch(closeConversation({
      _id
    }))
  }

  return (
    <div className={styles.messageFrame}>
      <div className={styles.messageHeader}>
        <Link style={{ marginBottom: 0 }}
          href={`/profile/${participant}`}>
          <a>
            <Avatar src={`${baseURL}/api/user/avatar/${participant}`}
              style={{ marginRight: '10px' }}
            />
            <span style={{ color: '#fff' }}>{participantInfo.name}{"   "}{participantInfo.activityStatus}</span>
          </a>
        </Link>

        <i style={{ cursor: 'pointer' }}
          onClick={handleClose}
          className="fas fa-times"></i>
      </div>
    </div>
  )
}
