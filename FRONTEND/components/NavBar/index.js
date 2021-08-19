import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { signout } from '../../store/reducers/user.reducer'
import { baseURL } from '../../utils/axios.util'
import eventManager from '../../utils/eventemiter'
import { Menu, Dropdown, Avatar } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import styles from './navbar.module.scss'

const NavbarDropdownMenu = ({ user }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  return <Menu>
    <Menu.Item key="0" style={{ height: "40px" }}>
      <Link href={`/profile/${user._id}`}>
        <a>
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <p>See you profile</p>
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

// const NavbarDropdownMenu = ({ user }) => {
//   const router = useRouter()
//   const dispatch = useDispatch()
// }

const NavBar = React.memo(function NavBar(props) {
  const user = useSelector(state => state.userReducer)
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
      <Link href="/">
        <a>
          <Image src="/images/facebook-brands.svg" alt="Facebook"
            width={40} height={40} />
        </a>
      </Link>
      {user.authenticated && <div>
        <span className={styles['username-header']}>
          <Link href={`/profile/${user.user._id}`}>
            <a>
              <Avatar
                key={avatarUpdated}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                src={`${baseURL}/api/user/avatar/${user.user._id}`} />
              <b>{user.user.name.split(' ')[0]}</b>
            </a>
          </Link>
        </span>
        <span className={styles['navbar-dropdown']}>
          <Dropdown overlay={<NavbarDropdownMenu user={user.user} />} trigger={['click']}>
            <FontAwesomeIcon className={styles['navbar-dropdown-icon']} icon={faCaretDown} />
          </Dropdown>
        </span>
      </div>}
    </div>
  )
})

export default NavBar