import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseURL } from '../../utils'

const initialState = {
  group: {},
  error: null,
  loading: false
}

export const getGroupById = createAsyncThunk('/getGroupById', async (data, { rejectWithValue }) => {
  try {
    let token = JSON.parse(window.localStorage.getItem('user')).token
    const response = await axios.get(`${baseURL}/api/groups/${data.groupId}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    if (response.status === 200) {
      return {
        group: response.data.group
      }
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const userListSlice = createSlice({
  name: 'group',
  initialState,
  extraReducers: {
    [getGroupById.pending]: (state, action) => {
      state.loading = true;
    },
    [getGroupById.fulfilled]: (state, action) => {
      state.group = action.payload.group
      state.loading = false;
    },
    [getGroupById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.error
    }
  }
})

export default userListSlice.reducer