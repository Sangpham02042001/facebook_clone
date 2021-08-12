import React from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import styles from './header.module.scss'

export default function Header() {
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
      {user.authenticated && <span className={styles['username-header']}>
        <Link href="/profile">
          <b>{user.user.name.split(' ')[0]}</b>
        </Link>
      </span>}
    </div>
  )
}