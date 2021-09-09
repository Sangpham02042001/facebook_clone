import React from 'react'
import { Avatar, Divider, Menu } from 'antd'
import { AppstoreOutlined, UserAddOutlined, SettingOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { baseURL } from '../../utils'
import styles from './group.module.scss'

const { SubMenu } = Menu

export default function ManageGroupMenu() {
  const group = useSelector(state => state.groupReducer.group)
  return (
    <div className={styles['manage-group']}>
      <div className={styles['manage-group-header']}>
        <Avatar src={`${baseURL}/api/group/coverphoto/${group._id}`}
          shape='square' size="large" style={{ width: '60px', height: '60px' }} />
        <div style={{ marginLeft: '15px' }}>
          <h3 style={{ fontWeight: '600' }}>{group.name}</h3>
          {group.isPublic ? <div>
            <i className="fas fa-globe-asia"></i> Public group
          </div>
            : <div>
              <i className="fas fa-lock"></i> Private group
            </div>}
        </div>
      </div>
      <Divider style={{ margin: '10px 0' }} />
      <div>
        <Link href={`/groups/${group._id}`}>
          <a className={styles['group-menu-link']}>
            <i className="fas fa-home"></i>
            <h3>Home</h3>
          </a>
        </Link>
      </div>
      <Divider style={{ margin: '10px 0' }} />
      <Menu
        className={styles['manage-group-menu']}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu key="sub1" title="Settings">
          <Menu.Item icon={<SettingOutlined />} key="1">Group Settings</Menu.Item>
          <Menu.Item icon={<AppstoreOutlined />} key="2">Add Features</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title="To Review">
          <Menu.Item icon={<UserAddOutlined />} key="5">Member Requests</Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" title="People">
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
          <Menu.Item key="13">Option 9</Menu.Item>
          <Menu.Item key="14">Option 10</Menu.Item>
          <Menu.Item key="15">Option 11</Menu.Item>
          <Menu.Item key="16">Option 12</Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  )
}
