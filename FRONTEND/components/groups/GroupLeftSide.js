import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Input, Divider, Avatar } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getGroupsManaged, getGroupsJoined } from '../../store/reducers/groupList.reducer'
import styles from './LeftSide.module.scss'
import { baseURL, getTimeDiff } from '../../utils'

export default function GroupLeftSide() {
  const dispatch = useDispatch()
  const [currentTab, setCurrentTab] = useState('')
  const router = useRouter()
  const groupListReducer = useSelector(state => state.groupListReducer)

  useEffect(() => {
    if (!groupListReducer.groupsManage.length && !groupListReducer.groupsManageLoaded) {
      dispatch(getGroupsManaged())
    }
  }, [groupListReducer.groupsManage])

  useEffect(() => {
    if (!groupListReducer.groupsJoined.length && !groupListReducer.groupsJoinedLoaded) {
      dispatch(getGroupsJoined())
    }
  }, [groupListReducer.groupsJoined])

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
      <Divider style={{ margin: '10px 0' }} />
      <h2>Group you manage</h2>
      {groupListReducer.groupsManage.map(group => (
        <Link key={group._id} href={`/groups/${group._id}`}>
          <a className={styles['group-item-link']}>
            <Avatar shape="square" style={{ width: '60px', height: '60px' }}
              src={`${baseURL}/api/group/coverphoto/${group._id}`} />
            <div style={{ marginLeft: '10px' }}>
              <h3>{group.name}</h3>
              <p>{`Updated at ${getTimeDiff(group.updatedAt)}`}</p>
            </div>
          </a>
        </Link>
      ))}
      <h2>Group you joined</h2>
    </div>
  )
}
