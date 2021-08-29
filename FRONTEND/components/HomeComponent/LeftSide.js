import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import AvatarProfile from '../AvatarProfile'
import styles from './home.module.scss'

export default function LeftSide() {
  const user = useSelector(state => state.userReducer.user)
  return (
    <div className={styles.leftSide}>
      <div>
        <Link href={`/profile/${user._id}`}>
          <a className={styles.leftSideLink}>
            <AvatarProfile showName={true} user={user} />
          </a>
        </Link>
      </div>
      <div>
        <Link href={`/friends`}>
          <a className={styles.leftSideLink}>
            <i className="fas fa-user-friends" style={{ marginRight: '10px' }}></i>
            Friends
          </a>
        </Link>
      </div>
    </div>
  )
}
