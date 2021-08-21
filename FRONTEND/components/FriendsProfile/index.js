import React from 'react'
import { Avatar } from 'antd'
import Link from 'next/link'
import { baseURL } from '../../utils'
import styles from './FriendsProfile.module.scss'

export default function FriendsProfile({ friends, setFriendTabs }) {
  return (
    <>
      <div className={styles.header}>
        <h2 onClick={setFriendTabs}><strong>Friends</strong></h2>
        <h3 onClick={setFriendTabs}>See All Friends</h3>
      </div>
      <p style={{ fontSize: '16px' }}>{friends.length} friends</p>
      <div className={styles.friendList}>
        {friends.map(friend => (
          <div key={friend._id}>
            <Link href={`/profile/${friend._id}`}>
              <a className={styles.friendItem}>
                <Avatar shape="square"
                  className={styles.avatar}
                  src={`${baseURL}/api/user/avatar/${friend._id}`}
                />
                <p>{friend.name}</p>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
