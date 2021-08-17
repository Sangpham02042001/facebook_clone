import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { axiosInstance, baseURL } from '../../utils/axios.util'
import axios from 'axios'
import extend from 'lodash/extend'

const initialState = {
  profile: {},
  error: null,
  loading: false
}

export const setProfileAsync = createAsyncThunk('profile/set', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseURL}/api/users/${data.userId}`, {
      headers: {
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user')).token)
      }
    })
    console.log(response.data)
    return { profile: response.data.user }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileSync: (state, action) => {
      state.profile = {
        ...action.payload.user,
        token: undefined
      }
      state.loading = false
    }
  },
  extraReducers: {
    [setProfileAsync.pending]: (state, action) => {
      state.loading = true
    },
    [setProfileAsync.fulfilled]: (state, action) => {
      state.profile = action.payload.profile
      state.loading = false
    },
    [setProfileAsync.rejected]: (state, action) => {
      state.loading = false
      state.error = action.payload.error
      state.loading = false
    }
  }
})

export const { setProfileSync } = profileSlice.actions

export default profileSlice.reducer