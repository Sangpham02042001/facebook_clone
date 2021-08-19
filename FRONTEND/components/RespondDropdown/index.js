import React from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Menu } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { confirmFriendRequest } from '../../store/reducers/user.reducer'
import { profileAddFriend } from '../../store/reducers/profile.reducer'
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

  return (
    <Menu>
      <Menu.Item key="0" onClick={handleConfirm} className={styles.dropdownItem}>
        <FontAwesomeIcon icon={faCheck} style={{ marginRight: '10px' }} />
        Confirm Request
      </Menu.Item>
      <Menu.Item key="1" className={styles.dropdownItem}>
        <FontAwesomeIcon icon={faTimes} style={{ marginRight: '10px' }} />
        Refuse
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  )
}

export default RespondDropdown