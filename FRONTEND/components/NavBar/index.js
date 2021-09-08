import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { signout } from '../../store/reducers/user.reducer'
import { baseURL } from '../../utils/axios.util'
import eventManager from '../../utils/eventemiter'
import { Menu, Dropdown, Avatar, Tooltip, Row, Col } from 'antd'
import SearchUserInput from '../SearchUserInput'
import { newConversation } from '../../store/reducers/conversation.reducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import styles from './navbar.module.scss'


const NavbarDropdownMenu = ({ user, avatarUpdated }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  return <Menu>
    <Menu.Item key="0">
      <Link href={`/profile/${user._id}`}>
        <a style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            style={{ marginRight: '10px' }}
            key={avatarUpdated} size='large'
            src={`${baseURL}/api/user/avatar/${user._id}`} />
          <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <p style={{ marginBottom: 0 }}>See you profile</p>
          </div>
        </a>
      </Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <p onClick={() => {
        dispatch(signout())
        router.push('/')
      }} ><b>Logout</b></p>
    </Menu.Item>
  </Menu>
}

const MessengerDropdown = ({ conversations, openMessage, userLoginId }) => {
  const handleMenuClick = (e) => {
    if (e.key === 'title') return;
    let idx = conversations.map(cv => cv._id).indexOf(e.key)
    openMessage(conversations[idx].participant)
  }
  return <Menu style={{ minWidth: '300px', maxHeight: '600px' }}
    onClick={handleMenuClick}>
    <Menu.Item key='title'>
      <h2>Messenger</h2>
    </Menu.Item>
    <Menu.Divider />
    {conversations.map((cv, idx) => (
      <Menu.Item key={cv._id} >
        <Row className={styles.messageUserItem}>
          <Col>
            <Avatar src={`${baseURL}/api/user/avatar/${cv.participant._id}`} size='large' />
          </Col>
          <Col offset={1} span={4}>
            <div style={{ fontSize: '15px' }}>{cv.participant.name}</div>
            <div style={{ fontSize: '13px' }} >{cv.messages[cv.messages.length - 1].sender === userLoginId ?
              'You: ' : cv.participant.name + ': '}
              {cv.messages[cv.messages.length - 1].content}
            </div>
          </Col>


        </Row>
      </Menu.Item>
    ))}
  </Menu>
}

const NavBar = React.memo(function NavBar(props) {
  const userReducer = useSelector(state => state.userReducer)
  const userList = useSelector(state => state.userListReducer.userList)
  const conversations = useSelector(state => state.conversationReducer.conversations)
  const [avatarUpdated, setAvatarUpdated] = useState('')
  const [currentPage, setCurrentPage] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    setCurrentPage(router.pathname)
  }, [router.pathname])

  useEffect(() => {
    eventManager.on('avatarUpdated', (time) => {
      console.log('navbar', time)
      avatarUpdated !== time && setAvatarUpdated(time)
    })
  }, [])

  const handleNewConversation = (participant) => {
    // event.preventDefault()
    dispatch(newConversation({
      user: participant
    }))
  }

  console.log('header render')

  return (
    <div className={styles['main-header']}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/">
          <a style={{ display: 'inline-block', marginRight: '15px' }}>
            <Image src="/images/facebook-brands.svg" alt="Facebook"
              width={40} height={40} />
          </a>
        </Link>
        <SearchUserInput userList={userList} />
      </span>
      <div className={styles['icon-list']}>
        <Link href="/">
          <Tooltip placement="bottom" title="Home">
            <span className={`${currentPage === '/' ? styles['current-page-icon'] : styles['page-icon']}`}>
              <i className="fas fa-home"></i>
            </span>
          </Tooltip>
        </Link>
        <Link href="/friends">
          <Tooltip placement="bottom" title='Friends'>
            <span className={`${currentPage === '/friends' ? styles['current-page-icon'] : styles['page-icon']}`}>
              <i className="fas fa-user-friends"></i>
            </span>
          </Tooltip>
        </Link>
        <Link href="/videos">
          <Tooltip placement="bottom" title='Videos'>
            <span className={`${currentPage === '/videos' ? styles['current-page-icon'] : styles['page-icon']}`} >
              <i className="fas fa-tv " ></i>
            </span>
          </Tooltip>
        </Link>
        <Link href="/groups/feeds">
          <Tooltip placement="bottom" title='Groups'>
            <span className={`${currentPage.startsWith('/groups') ? styles['current-page-icon'] : styles['page-icon']}`}>
              <i className="fas fa-users"></i>
            </span>
          </Tooltip>
        </Link>
      </div>
      {userReducer.authenticated && <div>
        <span className={styles['username-header']}>
          <Link href={`/profile/${userReducer.user._id}`}>
            <a>
              <Avatar
                key={avatarUpdated}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                src={`${baseURL}/api/user/avatar/${userReducer.user._id}`} />
              <span style={{ color: "black", fontWeight: "500", fontSize: "15px" }}>{userReducer.user.name.split(' ')[0]}</span>
            </a>
          </Link>
        </span>
        <span className={styles.messenger}>
          <Dropdown overlay={<MessengerDropdown
            conversations={conversations} userLoginId={userReducer.user._id}
            openMessage={handleNewConversation} />}
            trigger={['click']}>
            <i className={`fab fa-facebook-messenger ${styles.messengerIcon}`}></i>
          </Dropdown>
        </span>
        <span className={styles['navbar-dropdown']}>
          <Dropdown overlay={<NavbarDropdownMenu
            user={userReducer.user} avatarUpdated={avatarUpdated} />}
            trigger={['click']}>
            {/* <FontAwesomeIcon className={styles['navbar-dropdown-icon']} icon={faCaretDown} /> */}
            <i className={`fas fa-caret-down ${styles['navbar-dropdown-icon']}`}></i>
          </Dropdown>
        </span>
      </div>}
    </div>
  )
})

export default NavBar