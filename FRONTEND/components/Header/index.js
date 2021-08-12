import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { isAuthenticated } from '../../actions'
import { isAuthenticated } from '../../reducers/user.reducer'
import Link from 'next/link'
import Image from 'next/image'
import styles from './header.module.scss'

export default function Header() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.userReducer)
  console.log('header render')
  useEffect(() => {
    if (!user.authenticated) {
      dispatch(isAuthenticated())
    }
  }, [user.authenticated])
  return (
    <div className={styles['main-header']}>
      <Link href="/">
        <a>
          <Image src="/images/facebook-brands.svg" alt="Facebook"
            width={40} height={40} />
        </a>
      </Link>
      {user.authenticated && <span className={styles['username-header']}>
        <Link href="/profile">
          <b>{user.user.name.split(' ')[0]}</b>
        </Link>
      </span>}
    </div>
  )
}
