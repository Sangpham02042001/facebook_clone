import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../../components/layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Row, Col, Divider, Avatar, Input,
  Select, Modal
} from 'antd'
import UploadImage from '../../components/UploadImage'
import { baseURL, showError, showWarning } from '../../utils'
import axios from 'axios'
import styles from './group.module.scss'

const { Option } = Select

export default function GroupsCreate() {
  let user = useSelector(state => state.userReducer.user)
  let [groupName, setGroupName] = useState('')
  let [isPublic, setIsPublic] = useState(true)
  let [coverPhoto, setCoverPhoto] = useState(null)
  let [previewCoverPhoto, setPreviewCoverPhoto] = useState(null)
  let router = useRouter()

  const createGroup = async e => {
    e.preventDefault()
    if (groupName.length < 6) {
      showWarning('Group name must be at least six characters')
      return
    }
    let formData = new FormData()
    formData.append('name', groupName)
    formData.append('isPublic', isPublic)
    formData.append('coverPhoto', coverPhoto)
    try {
      const response = await axios.post(`${baseURL}/api/groups`, formData, {
        headers: {
          'Authorization': 'Bearer ' + user.token,
          'Content-Type': 'application/json'
        },
      })
      console.log(response.data)
      if (response.status === 200) {
        router.push('/groups/feeds')
      }
    } catch (error) {
      console.log(error)
      showError('Something wrong when create group')
      setGroupName('')
      setCoverPhoto(null)
      setIsPublic(true)
      setPreviewCoverPhoto(null)
    }
  }

  const uploadCoverPhoto = (file) => {
    setCoverPhoto(file.originFileObj)
    let reader = new FileReader()
    reader.onload = e => {
      setPreviewCoverPhoto(e.target.result)
    }
    reader.readAsDataURL(file.originFileObj)
  }

  return (
    <>
      <Head>
        <title>Create Group | Facebook</title>
      </Head>
      <Layout>
        <Row style={{ backgroundColor: '#c0c0c0', position: 'relative' }}>
          <Col className={styles['left-side']}>
            <div style={{ marginTop: '60px' }}>
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
            <Select style={{ width: '100%' }} defaultValue="Choose privacy"
              onChange={value => setIsPublic(value === 'public' ? true : false)}
              className={styles['group-create-select']}>
              <Option value="public">
                <div className={styles['privacy-option']}>
                  <i className="fas fa-globe-asia"></i>
                  <div>
                    <h4>Public</h4>
                    <p>Anyone can see who's in the group and what they post.</p>
                  </div>
                </div>
              </Option>
              <Option value="private">
                <div className={styles['privacy-option']}>
                  <i className="fas fa-lock"></i>
                  <div>
                    <h4>Private</h4>
                    <p>Only members can see who's in the group and what they post.</p>
                  </div>
                </div>
              </Option>
            </Select>
            <h3>Group Cover Photo</h3>
            <UploadImage multiple={false} name="ProfileImage"
              content="Upload group cover photo" onUploadSuccess={uploadCoverPhoto} />
            <div className={styles['create-btn-container']}>
              <button onClick={createGroup}
                className={!groupName ? 'disabled' : ''} disabled={!groupName || !coverPhoto}>
                Create</button>
            </div>
          </Col>
          <Col offset={7} span={17} className={styles['group-preview-container']}>
            <div className={styles['group-preview']}>
              <div >
                <h3>Preview</h3>
              </div>
              <div className={styles['group-preview-item']}>
                <Image src={!previewCoverPhoto ? "/images/groups-default-cover-photo-2x.png" : previewCoverPhoto}
                  className={styles['image-preview']}
                  width={1000} height={400} />
                <div className={styles['group-preview-header']}>
                  <h1>
                    {groupName ? groupName : 'Group Name'}
                  </h1>
                  <div>
                    <span>
                      {isPublic ? <>
                        <i style={{ marginRight: '10px' }} className="fas fa-globe-asia"></i>
                        Public Group
                      </> : <>
                        <i style={{ marginRight: '10px' }} className="fas fa-lock"></i>
                        Private Group
                      </>}
                    </span> 1 members
                  </div>
                  <Divider />
                  <ul>
                    <li>About</li>
                    <li>Posts</li>
                    <li>Members</li>
                  </ul>
                </div>
                <div className={styles['group-preview-body']}>
                  <div className={styles['post-preview']}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i style={{ fontSize: '30px' }} className="far fa-user-circle"></i>
                      <Input disabled={true}
                        className={styles['post-input-preview']}
                        size="large" placeholder="What's on your mind?" />
                    </div>
                    <ul className={styles['post-preview-list']}>
                      <li>
                        <i className="fas fa-images"></i>
                        <span>Photo/Video</span>
                      </li>
                      <li>
                        <i className="fas fa-user-tag"></i>
                        <span>Tag People</span>
                      </li>
                      <li>
                        <i className="far fa-smile"></i>
                        <span>Feeling/Activity</span>
                      </li>
                    </ul>
                  </div>
                  <div className={styles['about-preview']}>
                    <h3>About</h3>
                    <div>
                      {isPublic ? <div>
                        <div className={styles['privacy-option']}>
                          <i className="fas fa-globe-asia"></i>
                          <div>
                            <h4>Public</h4>
                            <p>Anyone can see who's in the group and what they post.</p>
                          </div>
                        </div>
                        <div className={styles['privacy-option']}>
                          <i className="fas fa-eye"></i>
                          <div>
                            <h4>Visible</h4>
                            <p>Anyone can find this group</p>
                          </div>
                        </div>
                      </div>
                        : <div>
                          <div className={styles['privacy-option']}>
                            <i className="fas fa-lock"></i>
                            <div>
                              <h4>Private</h4>
                              <p>Only members can see who's in the group and what they post.</p>
                            </div>
                          </div>
                          <div className={styles['privacy-option']}>
                            <i className="fas fa-eye"></i>
                            <div>
                              <h4>Visible</h4>
                              <p>Anyone can find this group</p>
                            </div>
                          </div>
                        </div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    </>
  )
}
