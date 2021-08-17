import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { axiosInstance, baseURL } from '../../utils/axios.util'
import axios from 'axios'
import extend from 'lodash/extend'

const initialState = {
  user: {},
  error: null,
  authenticated: false,
  loading: false
}

export const signin = createAsyncThunk('user/signin', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/signin', {
      email, password
    });
    if (response.status === 200) {
      console.log(response.data)
      window.localStorage.setItem('user', JSON.stringify(response.data))
      return {
        user: response.data
      }
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const update = createAsyncThunk('user/udpate', async (data, { rejectWithValue }) => {
  let user = JSON.parse(localStorage.getItem('user'))
  let keys = Object.keys(data)
  let userData = new FormData()
  for (const key of keys) {
    userData.append(key, data[key])
  }
  console.log(user, data)
  try {
    const response = await axios.put(`${baseURL}/api/users/${user._id}`, userData, {
      headers: {
        'Authorization': 'Bearer ' + user.token
      },
    })
    console.log(response.data)
    return { user: response.data }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const addFriend = createAsyncThunk('user/addfriend', async (data, { getState, rejectWithValue }) => {
  const state = getState().userReducer
  console.log('addfriend', state)
  let userId = state.user._id
  console.log(data)
  try {
    const response = await axios.post(`${baseURL}/api/users/addfriend/${userId}`, data, {
      headers: {
        Authorization: 'Bearer ' + state.user.token
      }
    })
    console.log(response.data)
    return {
      userIdAdded: data.userIdAdded,
      name: response.data.name
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const cancelFriendRequest = createAsyncThunk('/user/cancelFrRequest', async (data, { getState, rejectWithValue }) => {
  const state = getState().userReducer
  try {
    let response = await axios.post(`${baseURL}/api/users/cancelrequest/${data.followerId}`, data, {
      headers: {
        Authorization: 'Bearer ' + state.user.token
      }
    })
    console.log(response.data)
    return {
      followingId: response.data.followingId
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    isAuthenticated: (state) => {
      const user = localStorage.getItem('user')
      if (user) {
        state.user = JSON.parse(user)
        state.authenticated = true;
        state.loading = false
      }
    },
    signout: (state) => {
      state.user = {}
      state.authenticated = false
      localStorage.removeItem('user')
    }
  },
  extraReducers: {
    [signin.pending]: (state, action) => {
      state.loading = true
    },
    [signin.fulfilled]: (state, action) => {
      state.loading = false
      state.authenticated = true
      state.user = action.payload.user
    },
    [signin.rejected]: (state, action) => {
      console.log(action)
      state.error = action.payload.error
      state.loading = false
    },
    [update.pending]: (state, action) => {
      console.log('update profile pending')
      // state.loading = true
    },
    [update.fulfilled]: (state, action) => {
      state.user = action.payload.user
      let currentUser = JSON.parse(localStorage.getItem('user'))
      currentUser = extend(currentUser, action.payload.user)
      localStorage.setItem('user', JSON.stringify(currentUser))
      // state.loading = false
    },
    [update.rejected]: (state, action) => {
      state.error = action.payload.error
      // state.loading = false
    },
    [addFriend.pending]: (state, action) => {
      // state.loading = true
    },
    [addFriend.fulfilled]: (state, action) => {
      state.user.followings.push({
        _id: action.payload.userIdAdded,
        name: action.payload.name
      })
      let currentUser = JSON.parse(localStorage.getItem('user'))
      currentUser = extend(currentUser, state.user)
      localStorage.setItem('user', JSON.stringify(currentUser))
      // state.loading = false
    },
    [addFriend.rejected]: (state, action) => {
      state.error = action.payload.error
      // state.loading = false
    },
    [cancelFriendRequest.pending]: (state, action) => {
      console.log("cancel fr req pending")
    },
    [cancelFriendRequest.fulfilled]: (state, action) => {
      let followingId = action.payload.followingId
      let idx = state.user.followings.map(user => user._id).indexOf(followingId)
      state.user.followings.splice(idx, 1)
    },
    [cancelFriendRequest.rejected]: (state, action) => {
      state.error = action.payload.error
    }
  }
})

export const { isAuthenticated, signout } = userSlice.actions

export default userSlice.reducer