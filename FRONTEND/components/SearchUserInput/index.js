import React, { useState, useEffect } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Input, Menu, Avatar } from 'antd'
import { baseURL } from '../../utils'
import styles from './SearchUserInput.module.scss'

export default function SearchUserInput({ userList }) {
  const router = useRouter()
  let { userId } = router.query
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    setSearchVal('')
  }, [userId])

  return (
    <div className={styles.searchInputContainer}>
      <Input
        className={styles.searchInput}
        placeholder="Search Fakebook"
        value={searchVal}
        onChange={e => setSearchVal(e.target.value)}
        prefix={<SearchOutlined className="site-form-item-icon" />}
      />
      {searchVal && <Menu className={styles.searchMenu}>
        {userList.filter(user => user.name.toLowerCase()
          .indexOf(searchVal.toLowerCase()) >= 0)
          .map(user => (
            <Menu.Item key={user._id}>
              <Link href={`/profile/${user._id}`}>
                <a>
                  <Avatar src={`${baseURL}/api/user/avatar/${user._id}`} />
                  <span style={{ marginLeft: '20px' }}>
                    {user.name}
                  </span>
                </a>
              </Link>
            </Menu.Item>
          ))}
      </Menu>}
    </div>
  )
}
