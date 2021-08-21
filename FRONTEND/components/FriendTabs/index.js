import React, { useState } from 'react'
import { Row, Col, Input, Avatar, Button, Dropdown } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { cancelFriendRequest } from '../../store/reducers/user.reducer'
import { cancelFollowing } from '../../store/reducers/profile.reducer'
import { baseURL, showError } from '../../utils'
import RespondDropdown from '../RespondDropdown'
import styles from './FriendTabs.module.scss'

const UserItem = ({ user, currentTab, ownProfile, userLoginId }) => {
  const router = useRouter()
  let { userId } = router.query
  const dispatch = useDispatch()
  const handleCancelRequest = (event) => {
    event.preventDefault()
    let followerId = user._id
    if (ownProfile) {
      followerId = userLoginId
      userId = user._id
    }
    if (!followerId) {
      showError('Some thing wrong, try again')
      return
    }
    dispatch(cancelFriendRequest({
      followerId,
      userId
    }))
    dispatch(cancelFollowing({
      followingId: followerId
    }))
  }

  return <div className={styles.userItem}>
    <Link href={`/profile/${user._id}`}>
      <a>
        <Avatar
          shape='square' className={styles.userAvatarSquare}
          src={`${baseURL}/api/user/avatar/${user._id}`} />
        <h2 style={{ marginLeft: '20px' }}>{user.name}</h2>
      </a>
    </Link>
    {/* {
      userLoginId === user._id
        ? (currentTab === 'allFriends' ? <Button ><Link href={`/profile/${user._id}`}>View Profile</Link></Button>
          : currentTab === 'followers' ? <Button onClick={handleCancelRequest} className={styles.cancelBtn}>Cancel Request</Button>
            : <Button>
              <Dropdown overlay={<RespondDropdown userLoginId={userLoginId} userId={user._id} />}
                trigger={['click']}>
                <span>Respond</span>
              </Dropdown>
            </Button>)
        : (
          // <Button ><Link href={`/profile/${user._id}`}>View Profile</Link></Button>
          currentTab === 'allFriends' ? <Button ><Link href={`/profile/${user._id}`}>View Profile</Link></Button>
            : currentTab === 'followers' ? <Button>
              <Dropdown overlay={<RespondDropdown userLoginId={userLoginId} userId={user._id} />}
                trigger={['click']}>
                <span>Respond</span>
              </Dropdown>
            </Button>
              : (ownProfile && <Button onClick={handleCancelRequest} className={styles.cancelBtn}>Cancel Request</Button>)
        )
    } */}
    {
      currentTab === 'allFriends' && <Button ><Link href={`/profile/${user._id}`}>View Profile</Link></Button>
    }
    {
      currentTab === 'followers' && (
        (userLoginId === user._id && !ownProfile) ? <Button onClick={handleCancelRequest} className={styles.cancelBtn}>Cancel Request</Button>
          : (ownProfile && <Button>
            <Dropdown overlay={<RespondDropdown userLoginId={userLoginId} user={user} />}
              trigger={['click']}>
              <span>Respond</span>
            </Dropdown>
          </Button>)
      )
    }
    {
      currentTab === 'followings' && (
        (userLoginId !== user._id && ownProfile) ? <Button onClick={handleCancelRequest} className={styles.cancelBtn}>Cancel Request</Button>
          : <Button>
            <Dropdown overlay={<RespondDropdown userLoginId={userLoginId} user={user} />}
              trigger={['click']}>
              <span>Respond</span>
            </Dropdown>
          </Button>
      )
    }
  </div>
}

export default function FriendTabs({ profile, ownProfile }) {
  const [currentTab, setCurrentTab] = useState('allFriends')
  const userReducer = useSelector(state => state.userReducer)

  const changeCurrentTab = tab => event => {
    event.preventDefault()
    if (tab !== currentTab) {
      setCurrentTab(tab)
    }
  }

  return (
    <Row>
      <Col className={styles.friendTabsContainer} span={24}>
        <div className={styles.friendTabHeader}>
          <h2>Friends</h2>
          <Input
            className={styles.searchInput}
            placeholder="Search"
            prefix={<SearchOutlined className="site-form-item-icon" />}
          />
        </div>
        <ul className={styles.friendTabSelection}>
          <li onClick={changeCurrentTab('allFriends')}
            className={currentTab === 'allFriends' ? (styles.currentTab) : ''}>
            All Friends
          </li>
          <li onClick={changeCurrentTab('followings')}
            className={currentTab === 'followings' ? (styles.currentTab) : ''}>
            Followings
          </li>
          <li onClick={changeCurrentTab('followers')}
            className={currentTab === 'followers' ? (styles.currentTab) : ''}>
            Followers
          </li>
        </ul>
        <div className={styles.userListContainer}>
          {
            currentTab === 'allFriends' && profile.friends && (
              profile.friends.length === 0
                ? <h1>No Friends</h1>
                : (profile.friends.map((user) => (
                  <UserItem key={user._id} user={user}
                    userLoginId={userReducer.user._id}
                    currentTab="allFriends" ownProfile={ownProfile} />
                )))
            )
          }
          {
            currentTab === 'followings' && profile.followings && (
              profile.followings.length === 0
                ? <h1>No Followings</h1>
                : (profile.followings.map((user) => (
                  <UserItem key={user._id} user={user}
                    userLoginId={userReducer.user._id}
                    currentTab="followings" ownProfile={ownProfile} />
                )))
            )
          }
          {
            currentTab === 'followers' && profile.followers && (
              profile.followers.length === 0
                ? <h1>No Followers</h1>
                : (profile.followers.map((user) => (
                  <UserItem key={user._id} user={user}
                    userLoginId={userReducer.user._id}
                    currentTab="followers" ownProfile={ownProfile} />
                )))
            )
          }
        </div>
      </Col>
    </Row>
  )
}
