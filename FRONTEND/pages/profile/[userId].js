import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Row, Col, Avatar, Image } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { baseURL } from '../../utils/axios.util'
import Layout from '../../components/layout'
import styles from './profile.module.scss'

export default function Profile() {
  const user = useSelector(state => state.userReducer)
  const router = useRouter()
  const { userId } = router.query
  console.log(userId)
  useEffect(() => {
    if (!user.authenticated) {
      router.push('/')
    }
  }, [user.authenticated])
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Layout>
        <Row style={{ justifyContent: 'center' }}>
          <Col span={12} className={styles.imageContainer}>
            <Image src={`${baseURL}/api/user/coverphoto/${userId}`}
              width={'100%'} alt="Cover Photo" />
            <span className={styles.avatar}>
              <Avatar size={156} src={`${baseURL}/api/user/photo/${userId}`} />
              <span className={styles.cameraContainer}>
                <FontAwesomeIcon className={styles.camera} icon={faCamera} />
              </span>
            </span>
          </Col>
        </Row>
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
