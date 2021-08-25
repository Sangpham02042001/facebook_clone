import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { signout } from '../../store/reducers/user.reducer'
import { baseURL } from '../../utils/axios.util'
import eventManager from '../../utils/eventemiter'
import { Menu, Dropdown, Avatar } from 'antd'
import SearchUserInput from '../SearchUserInput'
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

const MessengerDropdown = () => {
  return <Menu style={{ minWidth: '300px', maxHeight: '500px' }}>
    <Menu.Item key="1">
      <h2>Messenger</h2>
    </Menu.Item>
    <Menu.Divider />
  </Menu>
}

const NavBar = React.memo(function NavBar(props) {
  const userReducer = useSelector(state => state.userReducer)
  const userList = useSelector(state => state.userListReducer.userList)
  const [avatarUpdated, setAvatarUpdated] = useState('')

  useEffect(() => {
    eventManager.on('avatarUpdated', (time) => {
      console.log('navbar', time)
      avatarUpdated !== time && setAvatarUpdated(time)
    })
  }, [])

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
      {userReducer.authenticated && <div>
        <span className={styles['username-header']}>
          <Link href={`/profile/${userReducer.user._id}`}>
            <a>
              <Avatar
                key={avatarUpdated}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                src={`${baseURL}/api/user/avatar/${userReducer.user._id}`} />
              <b>{userReducer.user.name.split(' ')[0]}</b>
            </a>
          </Link>
        </span>
        <span className={styles.messenger}>
          <Dropdown overlay={<MessengerDropdown />}
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