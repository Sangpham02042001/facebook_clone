import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../../../components/layout'
import { getGroupById, joinGroup } from '../../../store/reducers/group.reducer'
import { Image, Button, Tooltip, Divider, Row, Col } from 'antd'
import AboutTab from '../../../components/GroupPage/AboutTab'
import styles from './groupPage.module.scss'
import { baseURL } from '../../../utils'
import DiscussionTab from '../../../components/GroupPage/DiscussionTab'
import ManageGroupMenu from '../../../components/GroupPage/ManageGroupMenu'

export default function GroupPage() {
  const [showMenu, setShowMenu] = useState(false)
  const [currentTab, setCurrentTab] = useState('discussion')
  const dispatch = useDispatch()
  const group = useSelector(state => state.groupReducer.group)
  const user = useSelector(state => state.userReducer.user)
  const isAdmin = group.admins && group.admins.map(user => user._id).indexOf(user._id) >= 0
  const isMember = group.memmbers && group.members.map(user => user._id).indexOf(user._id) >= 0
  const isRequestMember = group.request_members && group.request_members.map(user => user._id).indexOf(user._id) >= 0
  const router = useRouter()
  let { groupId } = router.query

  const toggleShowManageMenu = e => {
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

  const requestJoinGroup = () => {
    dispatch(joinGroup({
      _id: user._id,
      name: user.name,
      groupId
    }))
  }

  return (
    <>
      <Head>
        <title>{group.name} | Facebook</title>
      </Head>
      <Layout>
        {group._id && <div className={styles['group-page']}>
          {isAdmin && <Tooltip title="Show Menu" onClick={toggleShowManageMenu} placement="bottom">
            <i className={`fas fa-bars ${styles['menu-btn']}`}></i>
          </Tooltip>}
          {showMenu && <div className={styles['manage-group-menu']}>
            <div className={styles['manage-group-menu-header']}>
              <h2>Manage Group</h2>
              <Tooltip title="Show Menu" onClick={toggleShowManageMenu} placement="bottom">
                <i className={`fas fa-bars`}></i>
              </Tooltip>
            </div>
            <ManageGroupMenu />
          </div>}
          <div style={{ marginLeft: showMenu ? '360px' : 0 }}>
            <div className={styles['group-page-header']}>
              <div className={styles['group-coverphoto']}>
                <Image src={`${baseURL}/api/group/coverphoto/${group._id}`}
                  preview={false} />
                {isAdmin && <Button className={styles['edit-cover-photo-btn']}>
                  <i style={{ marginRight: '5px' }}
                    className="fas fa-pencil-alt"></i>
                  Edit
                </Button>}
              </div>
              <div className={styles['group-intro']}>
                <h1 style={{ marginBottom: '5px' }}>{group.name}</h1>
                <div className={styles['group-intro-header']}>
                  <div>
                    {group.isPublic ? <>
                      <i className="fas fa-globe-asia"></i>
                      Public Group</>
                      : <>
                        <i style={{ marginRight: '10px' }} className="fas fa-lock"></i>
                        Private Group
                      </>}
                    {" "}- {group.members.length} member
                  </div>
                  {!isMember && !isRequestMember && !isAdmin && <Button type="primary" onClick={requestJoinGroup}>
                    <i className="fas fa-user-plus"></i>
                    Join group
                  </Button>}
                  {isRequestMember && !isMember && <Button>
                    <i className="fas fa-times"></i>
                    Cancel Request
                  </Button>}
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
                  {(isMember || isAdmin || group.isPublic) &&
                    <li className={currentTab === 'members' ? styles['current-tab'] : ''}
                      onClick={changeCurrentTab('members')}>
                      Members</li>}
                </ul>
              </div>
            </div>
            <Divider style={{ margin: 0 }} />
            <Row className={styles['group-page-body']}>
              {currentTab === 'about' &&
                <AboutTab isPublic={group.isPublic}
                  members={group.members} admins={group.admins} createdAt={group.createdAt} />}
              {currentTab === 'discussion' &&
                <DiscussionTab posts={group.post} isMember={isMember} isAdmin={isAdmin}
                  isPublic={group.isPublic} about={group.about} />}
            </Row>
          </div>
        </div>}
      </Layout>
    </>
  )
}
