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
      let group = response.data.group
      group.admins = group.admins.map(admin => admin.user)
      group.members = group.members.map(user => user.user)
      group.request_members = group.request_members.map(user => user.user)
      return {
        group
      }
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const joinGroup = createAsyncThunk('/joinGroup', async (data, { rejectWithValue }) => {
  try {
    let token = JSON.parse(window.localStorage.getItem('user')).token
    const response = await axios.post(`${baseURL}/api/group/${data.groupId}/join`, {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    console.log(response)
    if (response.status === 200) {
      return {
        _id: data._id,
        name: data.name
      }
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const groupSlice = createSlice({
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
    },
    [joinGroup.pending]: (state, action) => {
      state.loading = true;
    },
    [joinGroup.fulfilled]: (state, action) => {
      let { _id, name } = action.payload;
      state.group.request_members.push({ _id, name });
      state.loading = false;
    },
    [joinGroup.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    }
  }
})

export default groupSlice.reducer