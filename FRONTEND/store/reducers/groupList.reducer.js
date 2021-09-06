import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseURL } from '../../utils'

const initialState = {
  groupsManage: [],
  groupsJoined: [],
  error: null,
  loading: false,
  groupsManageLoaded: false,
  groupsJoinedLoaded: false
}

export const getGroupsManaged = createAsyncThunk('/getGroupsManaged', async () => {
  let { token } = JSON.parse(window.localStorage.getItem('user'))
  const response = await axios.get(`${baseURL}/api/groups/managebyuser`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return {
    groupsManage: response.data.groupsManage
  }
})

export const getGroupsJoined = createAsyncThunk('/getGroupsJoined', async () => {
  let { token } = JSON.parse(window.localStorage.getItem('user'))
  const response = await axios.get(`${baseURL}/api/groups/joinedbyuser`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return {
    groupsJoined: response.data.groupsJoined
  }
})

export const groupListSlice = createSlice({
  name: 'groupList',
  initialState,
  extraReducers: {
    [getGroupsManaged.pending]: (state, action) => {
      state.loading = true
    },
    [getGroupsManaged.fulfilled]: (state, action) => {
      state.loading = false
      state.groupsManage = action.payload.groupsManage
      state.groupsManageLoaded = true
    },
    [getGroupsManaged.rejected]: (state, action) => {
      console.log(action)
    },
    [getGroupsJoined.pending]: (state, action) => {
      state.loading = true
    },
    [getGroupsJoined.fulfilled]: (state, action) => {
      state.loading = false
      state.groupsJoined = action.payload.groupsJoined
      state.groupsJoinedLoaded = true
    },
    [getGroupsJoined.rejected]: (state, action) => {
      console.log(action)
    }
  }
})

export default groupListSlice.reducer