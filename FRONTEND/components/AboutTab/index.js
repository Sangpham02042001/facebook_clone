import React, { useState } from 'react'
import { Row, Col, Divider } from 'antd'
import MultipleInfo from './MultipleInfo'
import Relationship from './Relationship'
import styles from './AboutTab.module.scss'

export default function AboutTab({ user }) {
  const [currentTab, setCurrentTab] = useState('overview')

  const handleChangeTab = tab => event => {
    event.preventDefault()
    if (tab !== currentTab) {
      setCurrentTab(tab)
    }
  }

  return (
    <Row>
      <Col className={styles.aboutTabContainer} span={22}>
        <div className={styles.leftAboutTab}>
          <h2>About</h2>
          <ul className={styles.selectionList}>
            <li onClick={handleChangeTab('overview')}
              className={currentTab === 'overview' ? (styles.currentTab) : ''}>
              Overview
            </li>
            <li onClick={handleChangeTab('relationshipstatus')}
              className={currentTab === 'relationshipstatus' ? (styles.currentTab) : ''}>
              Relationship Status
            </li>
            <li onClick={handleChangeTab('work_and_education')}
              className={currentTab === 'work_and_education' ? (styles.currentTab) : ''}>
              Work and Education
            </li>
          </ul>
        </div>
        <Divider type="vertical"
          style={{ height: '100%', border: '0.5px solid gray', backgroundColor: 'gray' }} />
        <div className={styles.rightAboutTab}>
          {currentTab === 'overview' && <div>
            <Relationship relationshipStatus={user.relationshipStatus} />
          </div>}
          {currentTab === 'relationshipstatus' &&
            <Relationship relationshipStatus={user.relationshipStatus} />}
          {currentTab === 'work_and_education' && <div>
            <MultipleInfo title="Work"
              typeInfo="workplace"
              listInfo={user.workplace} />
            <MultipleInfo title="College"
              typeInfo="college"
              listInfo={user.college} />
          </div>}
        </div>
      </Col>
    </Row>
  )
}
