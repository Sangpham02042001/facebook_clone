import React from 'react'
import { useDispatch } from 'react-redux'
import { Menu } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { confirmFriendRequest } from '../../store/reducers/user.reducer'
import styles from './RespondDropdown.module.scss'

const RespondDropdown = ({ userLoginId, userId }) => {
  const dispatch = useDispatch()

  const handleConfirm = (event) => {
    // event.preventDefault()
    dispatch(confirmFriendRequest({
      followingId: userLoginId,
      userId: userId
    }))
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