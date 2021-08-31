import React from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Menu } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { confirmFriendRequest, removeFollower } from '../../store/reducers/user.reducer'
import { profileAddFriend, profileRemoveFollower } from '../../store/reducers/profile.reducer'
import styles from './RespondDropdown.module.scss'

const RespondDropdown = ({ userLoginId, user }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { userId } = router.query

  const handleConfirm = (event) => {
    // event.preventDefault()
    dispatch(confirmFriendRequest({
      followingId: userLoginId,
      userId: user._id
    }))
    if (userId === userLoginId) {
      dispatch(profileAddFriend({
        userId: user._id,
        name: user.name
      }))
    }
  }

  const handleRemove = (event) => {
    dispatch(removeFollower({
      followerId: user._id,
      userId: userLoginId
    }))
    if (userId === userLoginId) {
      dispatch(profileRemoveFollower({
        followerId: user._id
      }))
    }
  }

  return (
    <Menu>
      <Menu.Item key="0" onClick={handleConfirm} className={styles.dropdownItem}>
        {/* <FontAwesomeIcon icon={faCheck} style={{ marginRight: '10px' }} /> */}
        <i className="fas fa-check" style={{ marginRight: '10px' }}></i>
        Confirm Request
      </Menu.Item>
      <Menu.Item key="1" onClick={handleRemove} className={styles.dropdownItem}>
        {/* <FontAwesomeIcon icon={faTimes} style={{ marginRight: '10px' }} /> */}
        <i className="fas fa-times" style={{ marginRight: '10px' }}></i>
        Refuse
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  )
}

export default RespondDropdown