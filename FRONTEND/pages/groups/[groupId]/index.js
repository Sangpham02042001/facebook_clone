import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../../../components/layout'
import { getGroupById, groupSlice } from '../../../store/reducers/group.reducer'
import { Image, Button, Tooltip, Divider, Row, Col } from 'antd'
import AboutTab from '../../../components/GroupPage/AboutTab'
import styles from './groupPage.module.scss'
import { baseURL } from '../../../utils'

export default function GroupPage() {
  const [showMenu, setShowMenu] = useState(false)
  const [currentTab, setCurrentTab] = useState('discussion')
  const dispatch = useDispatch()
  const group = useSelector(state => state.groupReducer.group)
  const user = useSelector(state => state.userReducer.user)
  const isAdmin = group.admins && group.admins.map(user => user._id).indexOf(user._id) >= 0
  const router = useRouter()
  let { groupId } = router.query

  const toggleShowMenu = e => {
    e.preventDefault()
    setShowMenu(!showMenu)
  }

  useEffect(() => {
    if (groupId) {
      dispatch(getGroupById({
        groupId
      }))
    }
  }, [groupId])

  const changeCurrentTab = tab => e => {
    if (tab !== currentTab) {
      setCurrentTab(tab)
    }
  }

  return (
    <>
      <Head>
        <title>{group.name} | Facebook</title>
      </Head>
      <Layout>
        {group._id && <div className={styles['group-page']}>
          <Tooltip title="Show Menu" placement="bottom">
            <i className={`fas fa-bars ${styles['menu-btn']}`}></i>
          </Tooltip>
          <div className={styles['group-page-header']}>
            <div className={styles['group-coverphoto']}>
              <Image src={`${baseURL}/api/group/coverphoto/${group._id}`}
                preview={false} />
              {isAdmin && <Button className={styles['edit-cover-photo-btn']}>
                <i style={{ marginRight: '5px' }} onClick={toggleShowMenu}
                  className="fas fa-pencil-alt"></i>
                Edit
              </Button>}
            </div>
            <div className={styles['group-intro']}>
              <h1 style={{ marginBottom: '5px' }}>{group.name}</h1>
              <div className={styles['group-intro-header']}>
                {group.isPublic ? <>
                  <i className="fas fa-globe-asia"></i>
                  Public Group</>
                  : <>
                    <i className="fas fa-lock"></i>
                    Private Group
                  </>}
                {" "}- {group.members.length} member
              </div>
              <Divider style={{ color: 'black', marginBottom: 0 }} />
              <ul className={styles['selection-bar']}>
                <li className={currentTab === 'about' ? styles['current-tab'] : ''}
                  onClick={changeCurrentTab('about')}>
                  About
                </li>
                <li className={currentTab === 'discussion' ? styles['current-tab'] : ''}
                  onClick={changeCurrentTab('discussion')}>
                  Discussion
                </li>
                <li className={currentTab === 'members' ? styles['current-tab'] : ''}
                  onClick={changeCurrentTab('members')}>

                  Members</li>
              </ul>
            </div>
          </div>
          <Divider style={{ margin: 0 }} />
          <Row className={styles['group-page-body']}>
            {currentTab === 'about' &&
              <AboutTab isPublic={group.isPublic}
                members={group.members} admins={group.admins} createdAt={group.createdAt} />}
          </Row>
        </div>}
      </Layout>
    </>
  )
}
