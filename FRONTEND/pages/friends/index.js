import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Avatar } from 'antd'
import Layout from '../../components/layout'
import MessageBoxs from '../../components/MessageBoxs'
import Link from 'next/link'
import Head from 'next/head'
import {
  isAuthenticated, unfriend, confirmFriendRequest,
  addFriend, removeFollower
} from '../../store/reducers/user.reducer'
import styles from './friends.module.scss'
import { baseURL } from '../../utils'

const UserItem = (props) => {
  return <div className={styles.userItem}>
    <Link href={`/profile/${props.user._id}`}>
      <Avatar shape='square' src={`${baseURL}/api/user/avatar/${props.user._id}`}
        className={styles.userAvatar}
      />
    </Link>
    <div className={styles.userItemInfo}>
      <h2 style={{ marginBottom: 0 }}>{props.user.name}</h2>
      {props.children}
    </div>
  </div>
}

export default function FriendsPage() {
  const [currentTab, setCurrentTab] = useState('home')
  const userReducer = useSelector(state => state.userReducer)
  const suggestionList = useSelector(state => state.userListReducer.userList).filter(user => {
    return userReducer.user.friends.map(u => u._id).indexOf(user._id) < 0
      && user._id !== userReducer.user._id
      && userReducer.user.followers.map(u => u._id).indexOf(user._id) < 0
      && userReducer.user.followings.map(u => u._id).indexOf(user._id) < 0
  })
  const dispatch = useDispatch()

  const changeTab = tab => event => {
    event.preventDefault()
    if (tab !== currentTab) {
      setCurrentTab(tab)
    }
  }

  const handleUnfriend = ({ friendId }) => event => {
    event.preventDefault()
    let confirm = window.confirm('Unfriend this user ??')
    if (confirm) {
      dispatch(unfriend({
        userId: userReducer.user._id,
        friendId
      }))
    }
  }

  const handleConfirm = ({ userId }) => event => {
    event.preventDefault()
    dispatch(confirmFriendRequest({
      followingId: userReducer.user._id,
      userId: userId
    }))
  }

  const handleAddFriend = ({ userId }) => event => {
    event.preventDefault()
    dispatch(addFriend({
      userIdAdded: userId
    }))
  }

  const handleRemoveFollower = ({ followerId }) => event => {
    event.preventDefault()
    dispatch(removeFollower({
      followerId,
      userId: userReducer.user._id
    }))
  }

  return (
    <Layout>
      <Head>
        <title>Friends</title>
      </Head>
      <MessageBoxs />
      <Row style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Col span={6} className={styles.leftSideCol}>
          <h1>Friends</h1>
          <div className={currentTab === 'home' ? styles.activate : ''} onClick={changeTab('home')}>
            <i className="fas fa-user-friends"></i>
            <h2>Home</h2>
          </div>
          <div className={currentTab === 'fr_req' ? styles.activate : ''} onClick={changeTab('fr_req')}>
            <i className="fas fa-user-plus"></i>
            <h2>Friends Request</h2>
          </div>
          <div className={currentTab === 'suggestions' ? styles.activate : ''} onClick={changeTab('suggestions')}>
            <i className="fas fa-user-plus"></i>
            <h2>Suggetions</h2>
          </div>
          <div className={currentTab === 'all_fr' ? styles.activate : ''} onClick={changeTab('all_fr')}>
            <i className="fas fa-user-friends"></i>
            <h2>All friends</h2>
          </div>
        </Col>
        <Col offset={6} className={styles.rightSide} span={18}>
          {currentTab === 'home' &&
            <>
              <h1>Friends</h1>
              <div className={styles.rightSideUserList}>
                {userReducer.user.friends && userReducer.user.friends.map(user => (
                  <UserItem key={user._id + 'home'} user={user}>
                    <span className={`${styles['userItemBtn']} ${styles['profileLink']}`}>
                      <Link href={`/profile/${user._id}`} >View Profile</Link>
                    </span>
                    <span onClick={handleUnfriend({
                      friendId: user._id
                    })}
                      className={`${styles['userItemBtn']} ${styles['unfriendBtn']}`}>
                      Unfriend
                    </span>
                  </UserItem>
                ))}
              </div>

              <h1 style={{ marginTop: '20px' }}>Friend Request</h1>
              <div className={styles.rightSideUserList}>
                {userReducer.user.followers && userReducer.user.followers.map(user => (
                  <UserItem key={user._id + 'fr_req'} user={user}>
                    <span onClick={handleConfirm({
                      userId: user._id
                    })}
                      className={`${styles['userItemBtn']} ${styles['profileLink']}`}>
                      Confirm Request
                    </span>
                    <span onClick={handleRemoveFollower({
                      followerId: user._id
                    })}
                      className={`${styles['userItemBtn']} ${styles['unfriendBtn']}`}>
                      Delete Request
                    </span>
                  </UserItem>
                ))}
              </div>
            </>}
          {currentTab === 'fr_req' &&
            <>
              <h1 >Friend Request</h1>
              <div className={styles.rightSideUserList}>
                {userReducer.user.followers && userReducer.user.followers.map(user => (
                  <UserItem key={user._id + 'fr_req'} user={user}>
                    <span onClick={handleConfirm({
                      userId: user._id
                    })}
                      className={`${styles['userItemBtn']} ${styles['profileLink']}`}>
                      Confirm Request
                    </span>
                    <span className={`${styles['userItemBtn']} ${styles['unfriendBtn']}`}>
                      Delete Request
                    </span>
                  </UserItem>
                ))}
              </div>
            </>}
          {currentTab === 'suggestions' &&
            <>
              <h1>Maybe you know</h1>
              <div className={styles.rightSideUserList}>
                {suggestionList.map(user => (
                  <UserItem key={user._id + 'sugg'} user={user}>
                    <span className={`${styles['userItemBtn']} ${styles['profileLink']}`}>
                      <Link href={`/profile/${user._id}`} >View Profile</Link>
                    </span>
                    <span onClick={handleAddFriend({
                      userId: user._id
                    })}
                      className={`${styles['userItemBtn']} ${styles['unfriendBtn']}`}>
                      Add friend
                    </span>
                  </UserItem>
                ))}
              </div>
            </>}
          {currentTab === 'all_fr' &&
            <>
              <h1>Friends</h1>
              <div className={styles.rightSideUserList}>
                {userReducer.user.friends.map(user => (
                  <UserItem key={user._id + 'all_fr'} user={user}>
                    <span className={`${styles['userItemBtn']} ${styles['profileLink']}`}>
                      <Link href={`/profile/${user._id}`} >View Profile</Link>
                    </span>
                    <span onClick={handleUnfriend({
                      friendId: user._id
                    })}
                      className={`${styles['userItemBtn']} ${styles['unfriendBtn']}`}>
                      Unfriend
                    </span>
                  </UserItem>
                ))}
              </div>
            </>}
        </Col>
      </Row>
    </Layout>
  )
}
