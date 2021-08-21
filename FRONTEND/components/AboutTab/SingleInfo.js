import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { update } from '../../store/reducers/user.reducer'
import { updateProfile } from '../../store/reducers/profile.reducer'
import { Input, Button, Dropdown, Menu } from 'antd'
import styles from './AboutTab.module.scss'

const EditMenu = ({ onDelete, onEdit }) => {
  return (
    <Menu>
      <Menu.Item key="0" onClick={onEdit}>
        Edit
      </Menu.Item>
      <Menu.Item key="1" onClick={onDelete}>
        Delete
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  )
}

export default function SingleInfo({ title, typeInfo, info, ownProfile, iconClassName }) {
  const [editing, setEditing] = useState(false)
  const [newVal, setNewVal] = useState(info || '')
  const dispacth = useDispatch()

  const toggleEditting = () => {
    setEditing(!editing)
  }

  const cancelChange = e => {
    e.preventDefault()
    setEditing(false)
    setNewVal(info || '')
  }

  const saveChange = value => event => {
    event && event.preventDefault && event.preventDefault()
    let type
    switch (typeInfo) {
      case 'current city':
        type = 'currentCity'
        break;
      case 'come from':
        type = 'from'
        break;
    }
    dispacth(update({
      [type]: value
    }))
    dispacth(updateProfile({
      [type]: value
    }))
    setEditing(false)
  }

  return (
    <div>
      {title && <h2>{title}</h2>}
      {
        editing ? <div>
          <Input
            placeholder={`Add ${typeInfo}`}
            value={newVal}
            onChange={event => setNewVal(event.target.value)}
          />
          <div className={styles.btnList}>
            <Button className={styles.cancelBtn} onClick={cancelChange} >Cancel</Button>
            <Button type='primary' onClick={saveChange(newVal)}
              disabled={newVal === '' || newVal === info}>Save</Button>
          </div>
        </div>
          : (!info ? (ownProfile ? <div className={styles.addInfo} onClick={toggleEditting}>
            <i className={`fas fa-plus-circle ${styles.addInfoIcon}`}></i>
            {`Add ${typeInfo}`}
          </div> : <div>
            No {typeInfo} to show
          </div>)
            : <p className={styles.subInfoLine}>
              <span>
                <i className={iconClassName} style={{ marginRight: '10px' }}></i>
                {info}
              </span>
              {ownProfile && <Dropdown
                overlay={<EditMenu
                  onEdit={() => setEditing(true)}
                  onDelete={saveChange(undefined)} />}
                trigger={['click']}>
                <i style={{ cursor: 'pointer' }} className="fas fa-ellipsis-h"></i>
              </Dropdown>}
            </p>)
      }
    </div>
  )
}
