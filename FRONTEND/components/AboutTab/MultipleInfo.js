import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { update } from '../../store/reducers/user.reducer'
// import { updateProfile } from '../../store/reducers/profile.reducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Button, Input } from 'antd'
import styles from './AboutTab.module.scss'

export default function MultipleInfo({ title, typeInfo, listInfo }) {
  const [editing, setEditing] = useState(false)
  const [newInfo, setNewInfo] = useState('')
  const toggleEditting = event => {
    event.preventDefault()
    setEditing(!editing)
  }

  const cancelUpdate = event => {
    event.preventDefault()
    setEditing(false)
    setNewInfo('')
  }

  const handleUpdate = () => {
    console.log(newInfo)
    setEditing(false)
  }

  return (
    <div>
      <h2>{title}</h2>
      {!editing
        ? <div className={styles.addInfo} onClick={toggleEditting}>
          <FontAwesomeIcon icon={faPlusCircle} className={styles.addInfoIcon} />
          {`Add a ${typeInfo}`}
        </div>
        : <div>
          <Input
            placeholder={`Add a ${typeInfo}`}
            value={newInfo}
            onChange={e => setNewInfo(e.target.value)} />
          <div className={styles.btnList}>
            <Button onClick={cancelUpdate} className={styles.cancelBtn}>Cancel</Button>
            <Button onClick={handleUpdate} type='primary'
              disabled={newInfo === ''}
            >Save</Button>
          </div>
        </div>}
      {listInfo.map(item => (
        <div key={item._id}>{item.name}</div>
      ))
      }
    </div>
  )
}
