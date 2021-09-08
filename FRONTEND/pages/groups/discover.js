import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'
import { Row, Col, Image } from 'antd'
import { getGroupsNotJoinedAndManage } from '../../store/reducers/groupList.reducer'
import GroupLeftSide from '../../components/groups/GroupLeftSide'
import styles from './group.module.scss'
import { baseURL } from '../../utils'

export default function GroupsDiscover() {
  const dispatch = useDispatch()
  const groupsNotJoined = useSelector(state => state.groupListReducer.groupsNotJoined)

  useEffect(() => {
    if (!groupsNotJoined.length) {
      dispatch(getGroupsNotJoinedAndManage())
    }
  }, [])

  return (
    <>
      <Head>
        <title>Discover Group | Facebook</title>
      </Head>
      <Layout>
        <Row style={{ backgroundColor: '#f2f2f7', minHeight: '100vh' }}>
          <Col className={styles['left-side']}>
            <GroupLeftSide />
          </Col>
          <Col offset={7} span={16}>
            <h1 style={{ fontWeight: '600', marginBottom: '5px' }}>Suggest for you</h1>
            <h2 style={{ color: 'gray' }}>Groups you might be interested in.</h2>
            <div className={styles['suggest-group-list']}>
              {groupsNotJoined.map(group => (
                <Link key={group._id} href={`/groups/${group._id}`}>
                  <a className={styles['suggest-group']}>
                    <Image preview={false} className={styles['suggest-group-image']}
                      src={`${baseURL}/api/group/coverphoto/${group._id}`} />
                    <div className={styles['suggest-group-body']}>
                      <h3><strong>{group.name}</strong></h3>
                      <p>{group.members[0]} members</p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </Col>
        </Row>
      </Layout>
    </>
  )
}
