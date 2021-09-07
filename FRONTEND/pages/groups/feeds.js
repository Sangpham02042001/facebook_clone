import React from 'react'
import { useSelector } from 'react-redux'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'
import { Row, Col } from 'antd'
import GroupLeftSide from '../../components/groups/GroupLeftSide'
import styles from './group.module.scss'

export default function GroupsFeeds() {
  const groupsJoined = useSelector(state => state.groupListReducer.groupsJoined)
  return (
    <>
      <Head>
        <title>Groups | Facebook</title>
      </Head>
      <Layout>
        <Row>
          <Col className={styles['left-side']}>
            <GroupLeftSide />
          </Col>
          <Col offset={7} span={17}>
            {!groupsJoined.length && <h2>
              Haven't joined any groups
              <br />
              <Link href="/groups/discover">
                Explore here
              </Link>
            </h2>}
          </Col>
        </Row>
      </Layout>
    </>
  )
}
