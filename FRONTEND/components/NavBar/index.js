import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { signout } from '../../store/reducers/user.reducer'
import { baseURL } from '../../utils/axios.util'
import { Menu, Dropdown, Avatar } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import styles from './navbar.module.scss'

const NavbarDropdownMenu = ({ user }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  return <Menu>
    <Menu.Item key="0" style={{ height: "40px" }}>
      <Link href="/profile">
        <a>
          <h2 style={{ margin: 0 }}>{user.user.name}</h2>
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

export default function Navbar() {
  const user = useSelector(state => state.userReducer)
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
                style={{ marginRight: '5px', marginBottom: '5px' }}
                src={`${baseURL}/api/user/avatar/${user.user._id}`} />
              <b>{user.user.name.split(' ')[0]}</b>
            </a>
          </Link>
        </span>
        <span className={styles['navbar-dropdown']}>
          <Dropdown overlay={<NavbarDropdownMenu user={user} />} trigger={['click']}>
            <FontAwesomeIcon className={styles['navbar-dropdown-icon']} icon={faCaretDown} />
          </Dropdown>
        </span>
      </div>}
    </div>
  )
}