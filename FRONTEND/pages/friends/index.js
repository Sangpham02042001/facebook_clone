import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Avatar } from 'antd'
import Layout from '../../components/layout'
import MessageBoxs from '../../components/MessageBoxs'
import Link from 'next/link'
import { isAuthenticated } from '../../store/reducers/user.reducer'
import styles from './friends.module.scss'
import { baseURL } from '../../utils'

const UserItem = (props) => {
  return <div className={styles.userItem}>
    <Avatar shape='square' src={`${baseURL}/api/user/avatar/${props.user._id}`}
      className={styles.userAvatar}
    />
    <div style={{ padding: '10px' }}>
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
  })
  const dispatch = useDispatch()

  // useEffect(() => {
  //   if (!userReducer.authenticated) {
  //     dispatch(isAuthenticated())
  //   }
  // }, [userReducer.authenticated])

  const changeTab = tab => event => {
    event.preventDefault()
    if (tab !== currentTab) {
      setCurrentTab(tab)
    }
  }

  return (
    <Layout>
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
        <Col offset={6} className={styles.rightSide} span={17}>
          {currentTab === 'home' &&
            <>
              <h1>Friends</h1>
              <div className={styles.rightSideUserList}>
                {userReducer.user.friends.map(user => (
                  <UserItem user={user}>
                    <Link href={`/profile/${user._id}`} >View Profile</Link>
                  </UserItem>
                ))}
              </div>

              <h1 style={{ marginTop: '20px' }}>Friend Request</h1>
              <div className={styles.rightSideUserList}>
                {userReducer.user.followers.map(user => (
                  <UserItem user={user}>
                    <Link href={`/profile/${user._id}`} >View Profile</Link>
                  </UserItem>
                ))}
              </div>
            </>}
          {currentTab === 'fr_req' &&
            <>
              <h1 >Friend Request</h1>
              <div className={styles.rightSideUserList}>
                {userReducer.user.followers.map(user => (
                  <UserItem user={user}>
                    <Link href={`/profile/${user._id}`} >View Profile</Link>
                  </UserItem>
                ))}
              </div>
            </>}
          {currentTab === 'suggestions' &&
            <>
              <h1>Maybe you know</h1>
              <div className={styles.rightSideUserList}>
                {suggestionList.map(user => (
                  <UserItem user={user}>
                    <Link href={`/profile/${user._id}`} >View Profile</Link>
                  </UserItem>
                ))}
              </div>
            </>}
          {currentTab === 'all_fr' &&
            <>
              <h1>Friends</h1>
              <div className={styles.rightSideUserList}>
                {userReducer.user.friends.map(user => (
                  <UserItem user={user}>
                    <Link href={`/profile/${user._id}`} >View Profile</Link>
                  </UserItem>
                ))}
              </div>
            </>}
        </Col>
      </Row>
    </Layout>
  )
}
