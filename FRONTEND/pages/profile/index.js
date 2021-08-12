import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Row, Col } from 'antd'
import Layout from '../../components/layout'
import styles from './profile.module.scss'

export default function Profile() {
  const user = useSelector(state => state.userReducer)
  const router = useRouter()
  useEffect(() => {
    if (!user.authenticated) {
      router.push('/signin')
    }
  }, [])
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Layout>
        <Row style={{ background: 'red', display: 'flex', justifyContent: 'center' }}>
          <Col className={styles.myCol} lg={12} md={16} >
            <h1>{user.user.name}</h1>
            {user.user.bio && <p>{user.user.bio}</p>}
          </Col>
        </Row>
      </Layout>
    </>
  )
}
