import React, { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import {
  Row, Col, Avatar, Image,
  Input, Button, Modal, Divider
} from 'antd'
import UploadImage from '../../components/UploadImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { showError } from '../../utils/utils'
import { baseURL } from '../../utils/axios.util'
import Layout from '../../components/layout'
import { update } from '../../store/reducers/user.reducer'
import axios from 'axios'
import styles from './profile.module.scss'

export default function Profile() {
  const dispatch = useDispatch()
  const userReducer = useSelector(state => state.userReducer)
  const userList = useSelector(state => state.userListReducer.userList)
  const [profile, setProfile] = useState('')
  const [reloadAvatar, setReloadAvatar] = useState('')
  const [newAvatar, setNewAvatar] = useState('')
  const [newCoverPhoto, setNewCoverPhoto] = useState('')
  const [reloadCoverPhoto, setReloadCoverPhoto] = useState('')
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(userReducer.user.bio)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [coverPhotoModalVisible, setCoverPhotoModalVisible] = useState(false)
  const router = useRouter()
  const avatarRef = useRef()
  const { userId } = router.query
  let userLoginId = userReducer.user._id

  useEffect(() => {
    if (userLoginId !== userId) {
      const fetchProfile = async () => {
        const response = await axios.get(`${baseURL}/api/users/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + userReducer.user.token
          }
        })
        setProfile(response.data.user)
      }
      fetchProfile()
    } else {
      setProfile(userReducer.user)
    }
  }, [])

  useEffect(() => {
    setBio(userReducer.user.bio)
  }, [userReducer.user.bio])

  useEffect(() => {
    if (userList.indexOf(userId) < 0) {
      router.push('/404')
      return;
    }
    if (!userReducer.authenticated) {
      router.push('/')
    }
  }, [userReducer.authenticated])

  const handleBioChange = e => {
    setBio(e.target.value)
  }

  const showModal = name => event => {
    console.log(name)
    switch (name) {
      case 'profile':
        console.log('profileee')
        setProfileModalVisible(true)
        break;
      case 'coverphoto':
        setCoverPhotoModalVisible(true)
        break;
    }
  }

  const cancelEditBio = () => {
    setEditing(false)
    setBio(userReducer.user.bio)
  }

  const saveBioChanged = () => {
    console.log(bio)
    setEditing(false)
    dispatch(update({ bio }))
  }

  const onUploadAvatarSuccess = (file) => {
    console.log(file)
    setNewAvatar(file.originFileObj)
  }

  const updateAvatar = () => {
    if (!newAvatar) {
      showError('You need to upload an image')
      return false
    }
    dispatch(update({
      avatar: newAvatar
    }))
    setProfileModalVisible(false)
    setReloadAvatar(Date.now())
  }

  const onUploadCoverPhotoSuccess = (file) => {
    console.log(file)
    setNewCoverPhoto(file.originFileObj)
  }

  const uploadCoverPhoto = () => {
    if (!newCoverPhoto) {
      showError('You need to upload an image')
      return false
    }
    dispatch(update({
      coverPhoto: newCoverPhoto
    }))
    setCoverPhotoModalVisible(false)
    setReloadCoverPhoto(Date.now())
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Layout>
        <Row style={{ justifyContent: 'center', height: '350px' }}>
          <Col span={14} className={styles.imageContainer}>
            {userId && userList.indexOf(userId) &&
              <Image src={`${baseURL}/api/user/coverphoto/${userId}?reload=${reloadCoverPhoto}`}
                className={styles.coverImage} preview={false}
                width={'100%'} height={320} alt="Cover Photo" />}
            {
              userId === userLoginId && <span className={styles.editCoverPhoto} onClick={showModal('coverphoto')}>
                <FontAwesomeIcon className={styles.camera} icon={faCamera} />
                <b style={{ marginLeft: '10px' }}>Edit Cover Photo</b>
              </span>
            }
            <span className={styles.avatar}>
              {userId && userList.indexOf(userId) &&
                <Avatar size={156} src={`${baseURL}/api/user/avatar/${userId}?reaload=${reloadAvatar}`} />}
              {userId === userLoginId &&
                <span onClick={showModal('profile')} className={styles.cameraContainer}>
                  <FontAwesomeIcon className={styles.camera} icon={faCamera} />
                </span>}
            </span>
          </Col>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
          <Col className={styles.shortIntro} lg={14} md={16} >
            {userLoginId === userId ? <h1>{userReducer.user.name}</h1>
              : <h1>{profile.name}</h1>}
            {!editing && userLoginId === userId && (
              !userReducer.loading ? <>
                {userReducer.user.bio && <p>{userReducer.user.bio}</p>}
                <p style={{ color: '#00bbf0', cursor: 'pointer', marginBottom: 0 }}
                  onClick={() => setEditing(true)}>
                  Edit</p>
              </> : <Image width={40} height={40} src="/images/spinner-loading.gif" alt="Updating..." />
            )}
            {editing && userLoginId === userId && <div className={styles.editBioContainer}>
              <Input.TextArea rows={3} value={bio} onChange={handleBioChange} />
              <p style={{ color: 'gray', textAlign: 'right' }}>{100 - bio.length} characters remaining</p>
              <div className={styles.editBioBtn}>
                <Button onClick={cancelEditBio}>Cancel</Button>
                <Button disabled={bio === userReducer.user.bio} onClick={saveBioChanged}>Save</Button>
              </div>
            </div>}
            <Divider style={{ marginBottom: 0 }} />
          </Col>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
          <Col className={styles.shortIntro} lg={14} md={16}>
            <p>HIHI</p>
          </Col>
        </Row>
      </Layout>
      {profileModalVisible &&
        <Modal title="Update your profile image" visible={profileModalVisible}
          onCancel={() => {
            setProfileModalVisible(false)
            setNewAvatar('')
          }}
          onOk={updateAvatar}>
          <UploadImage multiple={false} name="ProfileImage"
            onUploadSuccess={onUploadAvatarSuccess} />
        </Modal>}

      {coverPhotoModalVisible &&
        <Modal title="Update your cover image" visible={coverPhotoModalVisible}
          onCancel={() => {
            setCoverPhotoModalVisible(false)
            setNewCoverPhoto('')
          }}
          onOk={uploadCoverPhoto}>
          <UploadImage multiple={false} name="CoverPhoto"
            onUploadSuccess={onUploadCoverPhotoSuccess} />
        </Modal>}
    </>
  )
}
