import React from 'react'
import styles from './IntroProfile.module.scss'

export default function IntroProfile({ profile }) {
  return (
    <>
      <h2><strong>Intro</strong></h2>
      {profile.followers && profile.followers.length > 0
        && <div className={styles.infoLine}>
          <i className="fas fa-user-plus"></i>
          <span>Followed by <b>
            {profile.followers.length} people
          </b>
          </span>
        </div>}
      {profile.from
        && <div className={styles.infoLine}>
          <i className="fas fa-home"></i>
          <span>Come from <b>{profile.from}</b></span>
        </div>}
      {profile.colleges && profile.colleges.length > 0 &&
        <div className={styles.infoLine}>
          <i className="fas fa-graduation-cap"></i>
          <span>Studied  at <b>{profile.colleges[0].name}</b></span>
        </div>}
      {profile.workplaces && profile.workplaces.length > 0 &&
        <div className={styles.infoLine}>
          <i className="fas fa-building"></i>
          <span>Work  at <b>{profile.workplaces[0].name}</b></span>
        </div>}
      {profile.relationshipStatus && <div className={styles.infoLine}>
        <i className="fas fa-heart"></i>
        <span><b>{profile.relationshipStatus}</b></span>
      </div>}
    </>
  )
}
