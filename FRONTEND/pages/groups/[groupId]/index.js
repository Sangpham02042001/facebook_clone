import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../../../components/layout'
import { getGroupById } from '../../../store/reducers/group.reducer'
import { Image, Button } from 'antd'
import styles from './groupPage.module.scss'
import { baseURL } from '../../../utils'

export default function GroupPage() {
  const dispatch = useDispatch()
  const group = useSelector(state => state.groupReducer.group)
  const user = useSelector(state => state.userReducer.user)
  const isAdmin = group.admins && group.admins.map(user => user._id).indexOf(user._id) >= 0
  const router = useRouter()
  let { groupId } = router.query

  useEffect(() => {
    if (groupId) {
      dispatch(getGroupById({
        groupId
      }))
    }
  }, [groupId])

  return (
    <>
      <Head>
        <title>{group.name} | Facebook</title>
      </Head>
      <Layout>
        {group._id && <>
          <div className={styles['group-page-header']}>
            <div className={styles['group-coverphoto']}>
              <Image src={`${baseURL}/api/group/coverphoto/${group._id}`}
                preview={false} />
              {isAdmin && <Button className={styles['edit-cover-photo-btn']}>
                <i className="fas fa-pencil-alt"></i>
                Edit
              </Button>}
            </div>
          </div>
        </>}
      </Layout>
    </>
  )
}
