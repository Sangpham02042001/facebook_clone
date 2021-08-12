import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user.reducer';
import postsReducer from './reducers/posts.reducer';

const store = configureStore({
  reducer: {
    userReducer,
    postsReducer
  }
})

export default store