import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../utils/axios.util'

const initialState = {
  userList: []
}

export const getUserList = createAsyncThunk('userList/get', async () => {
  try {
    const response = await axiosInstance.get('/api/users')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {

  }
})

export const userListSlice = createSlice({
  name: 'userList',
  initialState,
  extraReducers: {
    [getUserList.fulfilled]: (state, action) => {
      console.log(action.payload)
      state.userList = action.payload.userList
    },
    [getUserList.rejected]: (state, action) => {
      console.log('get user list failed')
    }
  }
})

export default userListSlice.reducer