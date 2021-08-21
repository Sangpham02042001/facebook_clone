import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { update } from '../../store/reducers/user.reducer'
import { updateProfile } from '../../store/reducers/profile.reducer'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHeart, faEllipsisH, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Select, Button, Dropdown, Menu } from 'antd'
import styles from './AboutTab.module.scss'

const { Option } = Select

export default function Relationship({ relationshipStatus, ownProfile }) {
  const [editting, setEditing] = useState(false)
  const [status, setStatus] = useState(relationshipStatus || 'Status')
  const dispacth = useDispatch()

  const toggleEditting = () => {
    setEditing(!editting)
  }

  const handleStatusChange = status => {
    setStatus(status)
  }

  const cancelChange = event => {
    event.preventDefault()
    setStatus('Status')
    setEditing(false)
  }

  const handleUpdate = event => {
    event.preventDefault()
    if (status !== 'Status' && status !== relationshipStatus) {
      dispacth(update({
        relationshipStatus: status
      }))
      dispacth(updateProfile({
        relationshipStatus: status
      }))
      setEditing(false)
    }
  }

  const handleDelete = () => {
    let confirm = window.confirm('Remove the relationship from profile ???')
    if (!confirm) {
      return;
    }
    dispacth(update({
      relationshipStatus: undefined
    }))
    dispacth(updateProfile({
      relationshipStatus: undefined
    }))
  }

  return (
    <div style={{ width: '100%' }}>
      {editting ? <div>
        <Select
          showSearch
          style={{ width: '100%' }}
          optionFilterProp="children"
          value={status}
          onChange={handleStatusChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Option value="Status">Status</Option>
          <Option value="Single">Single</Option>
          <Option value="In a relationship">In a relationship</Option>
          <Option value="Engaged">Engaged</Option>
          <Option value="Married">Married</Option>
          <Option value="In a civil union">In a civil union</Option>
          <Option value="In a domestic partnership">In a domestic partnership</Option>
          <Option value="In an open relationship">In an open relationship</Option>
          <Option value="It's complicated">It's complicated</Option>
          <Option value="Seperated">Seperated</Option>
          <Option value="Divorced">Divorced</Option>
          <Option value="Widowed">Widowed</Option>
        </Select>
        <div className={styles.btnList}>
          <Button className={styles.cancelBtn} onClick={cancelChange}>Cancel</Button>
          <Button type='primary' onClick={handleUpdate}
            disabled={status === 'Status' || status === relationshipStatus}>Save</Button>
        </div>
      </div>
        :
        (!relationshipStatus
          ? (ownProfile ? <div onClick={toggleEditting} className={styles.addInfo}>
            {/* <FontAwesomeIcon icon={faPlusCircle} className={styles.addInfoIcon} /> */}
            <i className={`fas fa-plus-circle ${styles.addInfoIcon}`}></i>
            Add a relationship status
          </div> : <div>
            <i className="fas fa-heart" style={{ marginRight: '10px' }}></i>
            No relationship info to show
          </div>)
          : <div className={styles.relationShipStatusLine}>
            <span>
              {/* <FontAwesomeIcon icon={faHeart} style={{ marginRight: '10px' }} /> */}
              <i className="fas fa-heart" style={{ marginRight: '10px' }}></i>
              {relationshipStatus}
            </span>
            {/* <FontAwesomeIcon onClick={toggleEditting} icon={faEllipsisH} /> */}
            {ownProfile && <Dropdown
              overlay={<Menu>
                <Menu.Item key="0" onClick={toggleEditting}>
                  Edit
                </Menu.Item>
                <Menu.Item key="1" onClick={handleDelete}>
                  Delete
                </Menu.Item>
                <Menu.Divider />
              </Menu>}
              trigger={['click']}>
              <i className="fas fa-ellipsis-h" style={{ cursor: 'pointer' }}></i>
            </Dropdown>}
          </div>)}
    </div>
  )
}
