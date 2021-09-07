import React from 'react'
import { Divider, Avatar } from 'antd'
import Link from 'next/link'
import styles from './group.module.scss'
import { baseURL } from '../../utils'

export const convertUserList = (users) => {
  let str = ''
  if (users.length === 1) {
    str += users[0].name.split(' ')[0] + ' is'
  } else if (users.length === 2) {
    for (let i = 0; i < users.length; i++) {
      str += users[i].name.split(' ')[i] + ', '
    }
    str += ' are'
  } else {
    for (let i = 0; i < 2; i++) {
      str += users[i].name.split(' ')[i] + ', '
    }
    str += `and ${users.length - 2} others are`
  }
  return str;
}

export default function AboutTab({ members, admins, isPublic, createdAt }) {
  return (
    <>
      <div className={`${styles['group-item-container']} ${styles['about-item-container']}`}>
        <h2>About this group</h2>
        <Divider style={{ margin: '10px 0' }} />
        <div>
          <div className={styles['about-item-body']}>
            {isPublic ? <i className="fas fa-globe-asia"></i>
              : <i className="fas fa-lock"></i>}
            {isPublic ? <div>
              <h3>Public</h3>
              <p>Anyone can see who's in the group and what they post.</p>
            </div>
              : <div>
                <h3>Private</h3>
                <p>Only members can see who's in the group and what they post.</p>
              </div>}
          </div>
          <div className={styles['about-item-body']}>
            <i className="fas fa-eye"></i>
            <div>
              <h3>Visible</h3>
              <p>Anyone can find this group</p>
            </div>
          </div>
          <div className={styles['about-item-body']}>
            <i className="fas fa-clock"></i>
            <div>
              <h3>History</h3>
              <p>Group created on {createdAt}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles['group-item-container']} ${styles['about-item-container']}`}>
        <h2>Members - <span>{members.length}</span></h2>
        <Divider style={{ margin: '10px 0' }} />
        <div>
          {!members.length ? <p>No member in this group</p>
            : members.map(user => (
              <Link href={`/profile/${user._id}`}>
                <Avatar src={`${baseURL}/api/user/avatar/${user._id}`} />
              </Link>
            ))}
        </div>
        <div>
          {admins.map(user => (
            <Link href={`/profile/${user._id}`}>
              <Avatar key={user._id} style={{ cursor: 'pointer' }}
                src={`${baseURL}/api/user/avatar/${user._id}`} />
            </Link>
          ))}
        </div>
        <p>
          {admins.length < 2 ?
            `${convertUserList(admins)} admin`
            : `${convertUserList(admins)} admins`}
        </p>
      </div>
    </>
  )
}
