import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import {
  Row, Col, Avatar, Image,
  Input, Button, Modal, Divider, Dropdown, Menu
} from 'antd'
import UploadImage from '../../components/UploadImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCamera, faPencilAlt, faTimes,
  faUserPlus, faCheckCircle, faCheck
} from '@fortawesome/free-solid-svg-icons'
import { baseURL, showError } from '../../utils'
import eventManager from '../../utils/eventemiter'
import Layout from '../../components/layout'
import PostComponent from '../../components/PostComponent'
import FriendTabs from '../../components/FriendTabs'
import AboutTab from '../../components/AboutTab'
import Loading from '../../components/Loading'
import RespondDropdown from '../../components/RespondDropdown'
import { update, addFriend, cancelFriendRequest, unfriend, isAuthenticated } from '../../store/reducers/user.reducer'
import { setProfileAsync, setProfileSync, addFollower, cancelFollowing, removeFriend } from '../../store/reducers/profile.reducer'
import styles from './profile.module.scss'

export default function Profile() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { userId } = router.query
  const userReducer = useSelector(state => state.userReducer)
  const userList = useSelector(state => state.userListReducer.userList)
  // const profilePosts = useSelector(state => state.postReducer.posts
  //   .filter(post => post.userId._id === userId))
  const [currentTab, setCurrentTab] = useState('post')
  const profileReducer = useSelector(state => state.profileReducer)
  const profile = profileReducer.profile
  const [reloadAvatar, setReloadAvatar] = useState('')
  const [newAvatar, setNewAvatar] = useState('')
  const [newCoverPhoto, setNewCoverPhoto] = useState('')
  const [reloadCoverPhoto, setReloadCoverPhoto] = useState('')
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(userReducer.user.bio)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [coverPhotoModalVisible, setCoverPhotoModalVisible] = useState(false)
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false)
  let userLoginId = userReducer.user._id

  useEffect(() => {
    // if (userList.length > 0 && userList.indexOf(userId) < 0) {
    //   router.push('/404')
    //   return;
    // }
    if (userLoginId !== userId) {
      console.log(userReducer.user.token)
      dispatch(setProfileAsync({
        userId
      }))
    } else {
      dispatch(setProfileSync({
        user: userReducer.user
      }))
    }
    setCurrentTab('post')
  }, [userId])

  useEffect(() => {
    setBio(userReducer.user.bio)
  }, [userReducer.user.bio])

  useEffect(() => {
    if (!userReducer.authenticated) {
      dispatch(isAuthenticated())
    }
    if (userList.length > 0 && userList.indexOf(userId) < 0) {
      router.push('/404')
      return;
    }
    // if (!userReducer.authenticated) {
    //   router.push('/')
    // }
  }, [userReducer.authenticated])

  const handleBioChange = e => {
    setBio(e.target.value)
  }

  const showModal = name => event => {
    console.log(name)
    switch (name) {
      case 'profile':
        setProfileModalVisible(true)
        break;
      case 'coverphoto':
        setCoverPhotoModalVisible(true)
        break;
      case "editProfile":
        setEditProfileModalVisible(true)
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
    setTimeout(() => {
      setReloadAvatar(Date.now())
      eventManager.emit('avatarUpdated', Date.now())
    }, 3000)
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
    setTimeout(() => {
      setReloadCoverPhoto(Date.now())
    }, 3000)
  }

  const handleAddFriend = () => {
    dispatch(addFriend({
      userIdAdded: userId
    }))
    dispatch(addFollower({
      followerId: userLoginId,
      name: userReducer.user.name
    }))
  }

  const handleCancelRequest = () => {
    dispatch(cancelFriendRequest({
      followerId: userLoginId,
      userId: profile._id
    }))
    dispatch(cancelFollowing({
      followingId: userLoginId
    }))
  }

  const handleUnfriend = () => {
    let confirm = window.confirm('Unfriend this user ??')
    if (confirm) {
      dispatch(unfriend({
        userId: userLoginId,
        friendId: userId
      }))
      dispatch(removeFriend({
        userId: userLoginId
      }))
    }
  }

  const changeCurrentTab = tab => event => {
    event.preventDefault()
    if (tab !== currentTab) {
      setCurrentTab(tab)
    }
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Layout>
        {(!userReducer.loading && !profileReducer.loading)
          ? <>
            <Row style={{ justifyContent: 'center', height: '350px' }}>
              <Col span={14} className={styles.imageContainer}>
                {userId && userList.indexOf(userId) &&
                  <Image src={`${baseURL}/api/user/coverphoto/${userId}?reload=${reloadCoverPhoto}`}
                    className={styles.coverImage} preview={false}
                    key={reloadCoverPhoto}
                    width={'100%'} height={320} alt="Cover Photo" />}
                {
                  userId === userLoginId && <span className={styles.editCoverPhoto} onClick={showModal('coverphoto')}>
                    {/* <FontAwesomeIcon className={styles.camera} icon={faCamera} /> */}
                    <i className={`fas fa-camera ${styles.camera}`}></i>
                    <b style={{ marginLeft: '10px' }}>Edit Cover Photo</b>
                  </span>
                }
                <span className={styles.avatar}>
                  {userId && userList.indexOf(userId) &&
                    <Avatar size={156} key={reloadAvatar}
                      src={`${baseURL}/api/user/avatar/${userId}?reaload=${reloadAvatar}`} />}
                  {userId === userLoginId &&
                    <span onClick={showModal('profile')} className={styles.cameraContainer}>
                      {/* <FontAwesomeIcon className={styles.camera} icon={faCamera} /> */}
                      <i className={`fas fa-camera ${styles.camera}`}></i>
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
                <Divider style={{ marginBottom: 0, borderColor: 'rgb(190, 190, 190)' }} />
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
              <Col lg={14} md={16} className={styles.profileSelectionContainer}>
                <ul className={styles.profileSeletionList}>
                  <li onClick={changeCurrentTab('post')}
                    className={currentTab === 'post' ? (styles.currentTab) : ''}>Post
                  </li>
                  <li onClick={changeCurrentTab('about')}
                    className={currentTab === 'about' ? (styles.currentTab) : ''}>About
                  </li>
                  <li onClick={changeCurrentTab('friends')}
                    className={currentTab === 'friends' ? (styles.currentTab) : ''}>
                    Friends {profile.friends && profile.friends.length}
                  </li>
                </ul>
                {
                  userId === userLoginId ? <span onClick={showModal('editProfile')} className={styles.editProfileBtn}>
                    {/* <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: '10px' }} /> */}
                    <i className="fas fa-pencil-alt" style={{ marginRight: '10px' }}></i>
                    Edit Profile
                  </span> : (
                    userReducer.user.followings
                      && userReducer.user.followings.map(user => user._id).indexOf(userId) < 0 ?
                      (
                        userReducer.user.followers.map(user => user._id).indexOf(userId) >= 0
                          ? <span className={styles.addFriendBtn}>
                            <Dropdown overlay={<RespondDropdown userLoginId={userLoginId} userId={userId} />}
                              trigger={['click']}>
                              <span>Respond</span>
                            </Dropdown>
                          </span>
                          : (
                            userReducer.user.friends.map(user => user._id).indexOf(userId) >= 0
                              ? <span className={styles.addFriendBtn}>
                                <Dropdown
                                  overlay={<Menu>
                                    <Menu.Item key="0" onClick={handleUnfriend}>
                                      Unfriend
                                    </Menu.Item>
                                  </Menu>} trigger={['click']}>
                                  <span>
                                    {/* <FontAwesomeIcon icon={faCheck} style={{ marginRight: '10px' }} /> */}
                                    <i className="fas fa-check" style={{ marginRight: '10px' }}></i>
                                    Friend</span>
                                </Dropdown>
                              </span>
                              : <span className={styles.addFriendBtn} onClick={handleAddFriend}>
                                {/* <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '10px' }} /> */}
                                <i className="fas fa-user-plus" style={{ marginRight: '10px' }}></i>
                                Add friend
                              </span>
                          )
                      ) : <div>
                        <span className={styles.editProfileBtn} onClick={handleCancelRequest}>
                          {/* <FontAwesomeIcon icon={faTimes} style={{ marginRight: '10px' }} /> */}
                          <i className="fas fa-times" style={{ marginRight: '10px' }}></i>
                          Cancel Request
                        </span>
                      </div>
                  )
                }
                {/* <div>
                        <span className={styles.addFriendBtn} style={{ marginRight: '10px' }}>
                          <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '10px' }} />
                          Confirm Request
                        </span>
                        <span className={styles.editProfileBtn}>
                          <FontAwesomeIcon icon={faTimes} style={{ marginRight: '10px' }} />
                          Delete Request
                        </span>
                      </div> */}
              </Col>
            </Row>
            <Divider style={{ margin: 0, borderColor: 'rgb(190, 190, 190)' }} />
            <Row className={styles.profileContainerPage}>
              <Col span={16}>
                {/* {
                  currentTab === 'post' && profilePosts && profilePosts.map(post => (
                    <PostComponent key={post._id} post={post} />
                  ))
                } */}
                {
                  currentTab === 'about' && <AboutTab user={profileReducer.profile} ownProfile={userLoginId === userId} />
                }
                {
                  currentTab === 'friends' && (
                    profile && <FriendTabs profile={profile} ownProfile={userLoginId === userId} />)
                }
              </Col>
            </Row>
          </>
          : <Loading />}
      </Layout>
      {
        profileModalVisible &&
        <Modal title="Update your profile image" visible={profileModalVisible}
          onCancel={() => {
            setProfileModalVisible(false)
            newAvatar && setNewAvatar('')
          }}
          onOk={updateAvatar}>
          <UploadImage multiple={false} name="ProfileImage"
            onUploadSuccess={onUploadAvatarSuccess} />
        </Modal>
      }

      {
        coverPhotoModalVisible &&
        <Modal title="Update your cover image" visible={coverPhotoModalVisible}
          onCancel={() => {
            setCoverPhotoModalVisible(false)
            newCoverPhoto && setNewCoverPhoto('')
          }}
          onOk={uploadCoverPhoto}>
          <UploadImage multiple={false} name="CoverPhoto"
            onUploadSuccess={onUploadCoverPhotoSuccess} />
        </Modal>
      }

      {
        editProfileModalVisible &&
        <Modal title="Edit Profile" visible={editProfileModalVisible}
          width="720px"
          onCancel={() => {
            setEditProfileModalVisible(false)
            newAvatar && setNewAvatar('')
            newCoverPhoto && setNewCoverPhoto('')
          }}
          onOk={event => {
            event.preventDefault()
            setEditProfileModalVisible(false)
          }}>
          <div className={styles.rowEditModal}>
            <div>
              <h2>Profile Picture</h2>
              <span onClick={showModal('profile')}>Edit</span>
            </div>
            <Avatar size={156} key={reloadAvatar}
              src={`${baseURL}/api/user/avatar/${userId}?reaload=${reloadAvatar}`} />
          </div>
          <div className={styles.rowEditModal}>
            <div>
              <h2>Cover Photo</h2>
              <span onClick={showModal('coverphoto')}>Edit</span>
            </div>
            <Image src={`${baseURL}/api/user/coverphoto/${userId}?reload=${reloadCoverPhoto}`}
              preview={false} key={reloadCoverPhoto}
              width={'100%'} height={320} alt="Cover Photo" />
          </div>
          <div className={styles.rowEditModal}>
            <div>
              <h2>Bio</h2>
              <span onClick={() => setEditing(true)}>Edit</span>
            </div>
            {!editing && <p>{bio}</p>}
            {editing && <div className={styles.editBioContainer}>
              <Input.TextArea rows={3} value={bio} onChange={handleBioChange} />
              {
                bio && <p style={{ color: 'gray', textAlign: 'right' }}>{100 - bio.length} characters remaining</p>
              }
              <div className={styles.editBioBtn}>
                <Button onClick={cancelEditBio}>Cancel</Button>
                <Button disabled={bio === userReducer.user.bio} onClick={saveBioChanged}>Save</Button>
              </div>
            </div>}
          </div>
        </Modal>
      }
    </>
  )
}
