import React from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import { Row, Col } from 'antd'
import GroupLeftSide from '../../components/groups/GroupLeftSide'
import styles from './group.module.scss'

export default function GroupsDiscover() {
  return (
    <>
      <Head>
        <title>Discover | Facebook</title>
      </Head>
      <Layout>
        <Row style={{ backgroundColor: 'gray' }}>
          <Col className={styles['left-side']}>
            <GroupLeftSide />
          </Col>
        </Row>
      </Layout>
    </>
  )
}
