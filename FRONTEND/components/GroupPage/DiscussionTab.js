import React from 'react'
import { useSelector } from 'react-redux'
import { Row, Col, Image, Divider } from 'antd'
import styles from './group.module.scss'

export default function DiscussionTab({ posts, about, isPublic, isMember, isAdmin }) {
  let user = useSelector(state => state.userReducer.user)
  return (
    <div className={styles['discussion-page']}>
      <div className={styles['discussion-left-side']}>
        {!isPublic && !isMember && !isAdmin &&
          <div className={`${styles['group-item-container']} ${styles['private-group-message']}`}>
            <Image preview={false} src='/images/permissions_gray_wash.svg' />
            <h1>This Group is Private</h1>
            <p>Join this group to view or participate in discussions</p>
          </div>}
      </div>
      <div className={styles['group-item-container']}>
        <h2 style={{ marginBottom: 0 }}>About</h2>
        <Divider style={{ margin: '10px 0' }} />
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
      </div>
    </div>
  )
}
