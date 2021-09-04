import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Head from 'next/head'
import Layout from '../../components/layout'
import Link from 'next/link'
import { Row, Col, Divider, Avatar, Input, Select } from 'antd'
import { baseURL } from '../../utils'
import styles from './group.module.scss'

const { Option } = Select

export default function GroupsCreate() {
  let user = useSelector(state => state.userReducer.user)
  let [groupName, setGroupName] = useState('')
  return (
    <>
      <Head>
        <title>Create Group | Facebook</title>
      </Head>
      <Layout>
        <Row style={{ backgroundColor: 'gray' }}>
          <Col className={styles['left-side']}>
            <div>
              <Link href='/groups/feeds'>
                <i className={`fas fa-times ${styles['cancel-create-btn']}`}></i>
              </Link>
            </div>
            <Divider style={{ margin: '10px 0' }} />
            <div>
              <Link href='/groups/feeds'>Groups</Link>
              {' > '} Create Group
            </div>
            <h2>Create Group</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar style={{ marginRight: '15px' }} src={`${baseURL}/api/user/avatar/${user._id}`} />
              <div>
                <h4>{user.name}</h4>
                <p style={{ marginBottom: 0 }}>Admin</p>
              </div>
            </div>
            <Input size="large" className={styles['group-create-input']}
              placeholder="Group name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)} />
            <Select style={{ width: '100%' }} defaultValue="Choose privacy" className={styles['group-create-select']}>
              <Option value="jack">
                <div className={styles['privacy-option']}>
                  <i className="fas fa-globe-asia"></i>
                  <div>
                    <h4>Public</h4>
                    <p>Anyone can see who's in the group and what they post.</p>
                  </div>
                </div>
              </Option>
              <Option value="lucy">
                <div className={styles['privacy-option']}>
                  <i className="fas fa-lock"></i>
                  <div>
                    <h4>Private</h4>
                    <p>Only members can see who's in the group and what they post.</p>
                  </div>
                </div>
              </Option>
            </Select>
            <div className={styles['create-btn-container']}>
              <button>Create</button>
            </div>
          </Col>
        </Row>
      </Layout>
    </>
  )
}
