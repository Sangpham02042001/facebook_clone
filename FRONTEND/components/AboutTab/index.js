import React, { useState } from 'react'
import { Row, Col, Divider } from 'antd'
import MultipleInfo from './MultipleInfo'
import SingleInfo from './SingleInfo'
import Relationship from './Relationship'
import styles from './AboutTab.module.scss'

export default function AboutTab({ user, ownProfile }) {
  const [currentTab, setCurrentTab] = useState('overview')

  const handleChangeTab = tab => event => {
    event.preventDefault()
    if (tab !== currentTab) {
      setCurrentTab(tab)
    }
  }

  return (
    <Row>
      <Col className={styles.aboutTabContainer} span={24}>
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
            <li onClick={handleChangeTab('places_lived')}
              className={currentTab === 'places_lived' ? (styles.currentTab) : ''}>
              Places Lived
            </li>
          </ul>
        </div>
        <Divider type="vertical"
          style={{ height: '100%', border: '0.5px solid gray', backgroundColor: 'gray' }} />
        <div className={styles.rightAboutTab}>
          {currentTab === 'overview' && <div>
            <Relationship relationshipStatus={user.relationshipStatus} ownProfile={ownProfile} />
            <MultipleInfo ownProfile={ownProfile}
              iconClassName="fas fa-building"
              typeInfo="workplace"
              listInfo={user.workplaces} />
            <MultipleInfo ownProfile={ownProfile}
              iconClassName="fas fa-graduation-cap"
              typeInfo="college"
              listInfo={user.colleges} />
          </div>}
          {currentTab === 'relationshipstatus' &&
            <Relationship relationshipStatus={user.relationshipStatus} ownProfile={ownProfile} />}
          {currentTab === 'work_and_education' && <div>
            <MultipleInfo ownProfile={ownProfile} title="Work"
              typeInfo="workplace" iconClassName="fas fa-building"
              listInfo={user.workplaces} />
            <MultipleInfo ownProfile={ownProfile} title="College"
              typeInfo="college" iconClassName="fas fa-graduation-cap"
              listInfo={user.colleges} />
          </div>}
          {currentTab === 'places_lived' && <div>
            <SingleInfo ownProfile={ownProfile} title='Current City'
              typeInfo='current city' iconClassName="fas fa-map-marker"
              info={user.currentCity} />
            <SingleInfo ownProfile={ownProfile} title='Come from'
              typeInfo='come from' iconClassName="fas fa-home"
              info={user.from} />
          </div>}
        </div>
      </Col>
    </Row>
  )
}
