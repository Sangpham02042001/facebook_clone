import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NavBar from '../NavBar'
import { getUserList } from '../../store/reducers/userList.reducer'
import { getConversations } from '../../store/reducers/conversation.reducer'

export default function Layout(props) {
  const userList = useSelector(state => state.userListReducer.userList)
  const userReducer = useSelector(state => state.userReducer)
  const conversations = useSelector(state => state.conversationReducer.conversations)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userList.length) {
      console.log('layout dispacth')
      dispatch(getUserList())
    }
  }, [dispatch])

  useEffect(() => {
    if (userReducer.authenticated && !conversations.length) {
      dispatch(getConversations({
        userLoginId: userReducer.user._id
      }))
    }
  }, [userReducer.authenticated])

  return (
    <div>
      <NavBar />
      <div style={{ marginTop: '66px' }}>
        {props.children}
      </div>
    </div>
  )
}
