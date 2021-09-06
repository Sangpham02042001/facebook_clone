import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user.reducer';
import postReducer from './reducers/post.reducer';
import userListReducer from './reducers/userList.reducer'
import profileReducer from './reducers/profile.reducer';
import conversationReducer from './reducers/conversation.reducer';
import groupReducer from './reducers/group.reducer'

const store = configureStore({
  reducer: {
    userReducer,
    postReducer,
    userListReducer,
    profileReducer,
    conversationReducer,
    groupReducer
  }
})

export default store