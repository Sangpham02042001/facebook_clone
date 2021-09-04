import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './LeftSide.module.scss'

export default function GroupLeftSide() {
  const [currentTab, setCurrentTab] = useState('')
  const router = useRouter()
  useEffect(() => {
    setCurrentTab(router.pathname)
  }, [router.pathname])
  return (
    <div>
      <h1>Groups</h1>
      <Input
        className={styles['search-input']}
        placeholder="Search"
        prefix={<SearchOutlined className="site-form-item-icon" />}
      />
      <div style={{ marginTop: '10px' }}></div>
      <Link href='/groups/feeds'>
        <a className={`${styles['left-side-link']} ${currentTab === '/groups/feeds' ? styles['current-tab'] : ''}`}>
          <i className={`fas fa-newspaper ${styles['link-icon']}`}></i>
          Your feed
        </a>
      </Link>
      <Link href='/groups/discover'>
        <a className={`${styles['left-side-link']} ${currentTab === '/groups/discover' ? styles['current-tab'] : ''}`}>
          <i className={`fab fa-discourse ${styles['link-icon']}`}></i>
          Discover
        </a>
      </Link>
      <Link href='/groups/create'>
        <button className={styles['create-button']}>
          <i className="fas fa-plus" style={{ marginRight: '10px' }}></i>
          Create new group
        </button>
      </Link>
    </div>
  )
}
