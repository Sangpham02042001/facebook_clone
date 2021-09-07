import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseURL } from '../../utils'

const initialState = {
  groupsManage: [],
  groupsJoined: [],
  groupsNotJoined: [],
  error: null,
  loading: false,
  groupsManageLoaded: false,
  groupsJoinedLoaded: false,
  groupsNotJoinedLoaded: false
}

export const createGroup = createAsyncThunk('/createNewGroup', async (data) => {
  let { token } = JSON.parse(window.localStorage.getItem('user'))
  let { groupName, coverPhoto, isPublic } = data
  let formData = new FormData()
  formData.append('name', groupName)
  formData.append('isPublic', isPublic)
  formData.append('coverPhoto', coverPhoto)
  try {
    const response = await axios.post(`${baseURL}/api/groups`, formData, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    })
    console.log(response.data)
    return {
      group: response.data.group
    }
  } catch (error) {
    console.log(error)
    showError('Something wrong when create group')
    setGroupName('')
    setCoverPhoto(null)
    setIsPublic(true)
    setPreviewCoverPhoto(null)
  }
})

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

export const getGroupsNotJoinedAndManage = createAsyncThunk('/getGroupsNotJoinedAndManage', async () => {
  let { token } = JSON.parse(window.localStorage.getItem('user'))
  const response = await axios.get(`${baseURL}/api/groups/notjoinedbyuser`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return {
    groupsNotJoined: response.data.groupsNotJoined
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
    },
    [createGroup.pending]: (state, action) => {
      state.loading = true
    },
    [createGroup.fulfilled]: (state, action) => {
      let { group } = action.payload
      state.groupsManage.push(group)
      state.loading = false
    },
    [createGroup.rejected]: (state, action) => {
      state.loading = false
      console.log(action)
    },
    [getGroupsNotJoinedAndManage.pending]: (state, action) => {
      state.loading = true
    },
    [getGroupsNotJoinedAndManage.fulfilled]: (state, action) => {
      let { groupsNotJoined } = action.payload
      state.groupsNotJoined = groupsNotJoined
      state.loading = false
    },
    [getGroupsNotJoinedAndManage.rejected]: (state, action) => {
      console.log(action)
      state.loading = false
    }
  }
})

export default groupListSlice.reducer