import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { update } from '../../store/reducers/user.reducer'
import { updateProfile } from '../../store/reducers/profile.reducer'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEllipsisH, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Button, Input, Dropdown, Menu } from 'antd'
import { v4 } from 'uuid'
import styles from './AboutTab.module.scss'

const EditMenu = ({ typeInfo, infoId, onDelete, idx, onEdit }) => {
  const handleDelete = () => {
    onDelete(typeInfo, infoId)
  }

  const handleEdit = () => {
    onEdit(idx)
  }

  return (
    <Menu>
      <Menu.Item key="0" onClick={handleEdit}>
        Edit
      </Menu.Item>
      <Menu.Item key="1" onClick={handleDelete}>
        Delete
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  )
}

export default function MultipleInfo({ title, typeInfo, listInfo, ownProfile }) {
  const [addInfo, setAddInfo] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingArray, setEditingArray] = useState([])
  const [newInfoStartDate, setNewInfoStartDate] = useState('')
  const [newInfoEndDate, setNewInfoEndDate] = useState('present')
  const [editName, setEditName] = useState('')
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const dispatch = useDispatch()

  const toggleAddInfo = event => {
    event.preventDefault()
    setAddInfo(!addInfo)
  }

  useEffect(() => {
    setEditingArray(listInfo.map(info => false))
  }, [listInfo.length])

  const cancelUpdate = event => {
    event.preventDefault()
    setAddInfo(false)
    setNewName('')
    setNewInfoStartDate('')
    setNewInfoEndDate('present')
  }

  const toggleEditing = (idx) => {
    console.log(idx)
    setEditingArray(editingArray.map((edit, index) => (
      idx === index ? !edit : false
    )))
    setEditName(listInfo[idx].name)
    setEditStartDate(listInfo[idx].startDate)
    setEditEndDate(listInfo[idx].endDate)
  }

  const handleUpdate = () => {
    console.log(newName)
    setAddInfo(false)
    const newInfo = {
      _id: v4(),
      name: newName,
      startDate: newInfoStartDate,
      endDate: newInfoEndDate
    }
    dispatch(update({
      typeInfo: typeInfo,
      ...newInfo,
      tag: 'new'
    }))
    let type
    switch (typeInfo) {
      case 'workplace':
        type = 'workplaces'
        break
      case 'college':
        type = 'colleges'
        break
    }
    dispatch(updateProfile({
      [type]: [...listInfo, newInfo]
    }))
  }

  const handleDelete = (typeInfo, infoId) => {
    console.log('in side multiple', typeInfo, infoId)
    let idx = listInfo.map(info => info._id).indexOf(infoId)
    let newListInfo = [...listInfo]
    newListInfo.splice(idx, 1)
    dispatch(update({
      typeInfo: typeInfo,
      infoId: infoId,
      tag: 'delete'
    }))
    let type
    switch (typeInfo) {
      case 'workplace':
        type = 'workplaces'
        break
      case 'college':
        type = 'colleges'
        break
    }
    dispatch(updateProfile({
      [type]: newListInfo
    }))
  }

  const saveChange = (infoId, idx) => event => {
    event.preventDefault()
    let newInfo = {
      _id: infoId,
      name: editName,
      startDate: editStartDate,
      endDate: editEndDate
    }
    let newListInfo = [...listInfo]
    newListInfo.splice(idx, 1, newInfo)
    dispatch(update({
      typeInfo: typeInfo,
      ...newInfo,
      tag: 'update'
    }))
    let type
    switch (typeInfo) {
      case 'workplace':
        type = 'workplaces'
        break
      case 'college':
        type = 'colleges'
        break
    }
    dispatch(updateProfile({
      [type]: newListInfo
    }))
    setEditingArray(editingArray.map(item => false))
  }

  return (
    <div style={{ marginTop: '10px' }}>
      {title && <h2>{title}</h2>}
      {!addInfo
        ? (ownProfile && <div className={styles.addInfo} onClick={toggleAddInfo}>
          {/* <FontAwesomeIcon icon={faPlusCircle} className={styles.addInfoIcon} /> */}
          <i className={`fas fa-plus-circle ${styles.addInfoIcon}`}></i>
          {`Add a ${typeInfo}`}
        </div>)
        : <div>
          <Input
            placeholder={`Add a ${typeInfo}`}
            value={newName}
            onChange={e => setNewName(e.target.value)} />
          <div className={styles.dateInputContainer}>
            <div>
              <label htmlFor="startDate">Start date: </label>
              <Input type='date'
                id="startDate"
                value={newInfoStartDate}
                onChange={e => {
                  console.log(e.target.value)
                  setNewInfoStartDate(e.target.value)
                }} />
            </div>
            <div>
              <label htmlFor="endDate">End date: </label>
              <Input type='date'
                id="endDate"
                value={newInfoEndDate}
                onChange={e => setNewInfoEndDate(e.target.value)} />
            </div>
          </div>
          <div className={styles.btnList}>
            <Button onClick={cancelUpdate} className={styles.cancelBtn}>Cancel</Button>
            <Button onClick={handleUpdate} type='primary'
              disabled={newName === '' || newInfoStartDate === ''}
            >Save</Button>
          </div>
        </div>}
      {listInfo.map((item, idx) => (
        !editingArray[idx] ? <div key={item._id} className={styles.infoLine}>
          <p className={styles.subInfoLine}>
            <span>
              <i className={
                typeInfo === 'workplace' ? "fas fa-building" : "fas fa-graduation-cap"
              } style={{ marginRight: '10px' }}></i>
              {item.name}
            </span>
            {ownProfile && <Dropdown
              overlay={<EditMenu typeInfo={typeInfo}
                infoId={item._id} idx={idx}
                onEdit={toggleEditing}
                onDelete={handleDelete} />}
              trigger={['click']}>
              <i style={{ cursor: 'pointer' }} className="fas fa-ellipsis-h"></i>
            </Dropdown>}
          </p>
          <p><b>{item.startDate}</b> - <b>{item.endDate}</b></p>
        </div> : <div key={item._id}>
          <Input
            onChange={event => setEditName(event.target.value)}
            value={editName} />
          <div className={styles.dateInputContainer}>
            <div>
              <label htmlFor="startDate">Start date: </label>
              <Input type='date'
                id="startDate"
                onChange={event => setEditStartDate(event.target.value)}
                value={editStartDate} />
            </div>
            <div>
              <label htmlFor="endDate">End date: </label>
              <Input type='date'
                id="endDate"
                onChange={event => setEditEndDate(event.target.value)}
                value={editEndDate} />
            </div>
          </div>
          <div className={styles.btnList}>
            <Button onClick={event => {
              event.preventDefault()
              toggleEditing(idx)
            }} className={styles.cancelBtn}>Cancel</Button>
            <Button type='primary'
              disabled={editName === item.name
                && editStartDate === item.startDate
                && editEndDate === item.endDate}
              onClick={saveChange(item._id, idx)}>
              Save
            </Button>
          </div>
        </div>
      ))
      }
    </div>
  )
}
