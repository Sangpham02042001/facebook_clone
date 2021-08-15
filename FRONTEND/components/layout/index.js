import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Head from 'next/head'
import NavBar from '../NavBar'
import { getUserList } from '../../store/reducers/userList.reducer'

export default function Layout(props) {
  const userList = useSelector(state => state.userListReducer.userList)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userList.length) {
      console.log('layout dispacth')
      dispatch(getUserList())
    }
  }, [dispatch])

  return (
    <div>
      <Head>
        <link rel="icon" href="/images/facebook.ico" />
      </Head>
      <NavBar />
      <div style={{ marginTop: '66px' }}>
        {props.children}
      </div>
    </div>
  )
}
