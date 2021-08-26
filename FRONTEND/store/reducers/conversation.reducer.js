import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance, showWarning } from '../../utils'
import path from 'path';

const initialState = {
  conversations: [],
  error: ''
}

export const newConversation = createAsyncThunk('/newconversation', async (data, { getState, rejectWithValue }) => {
  const userLoggedIn = getState().userReducer.user
  const conversations = getState().conversationReducer.conversations
  let { _id } = data.user
  try {
    let checkIndex = conversations.map(cv => cv.participant._id).indexOf(_id)
    if (checkIndex >= 0) {
      if (conversations[checkIndex].visible) {
        showWarning("Already open")
        return { }
      } else {
        // get messages here
      }
    } else {
      return {
        conversation: {
          _id: _id,
          participant: data.user,
          messages: [],
          visible: true
        }
      }
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const sendMessage = createAsyncThunk('/sendMessage', async (data, { getState, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(path.join('api', data.senderId,'conversations'), data);
    return response.data;
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  extraReducers: {
    [newConversation.pending]: (state, action) => {

    },
    [newConversation.fulfilled]: (state, action) => {
      let { conversation } = action.payload
      if (conversation) {
        state.conversations.push(conversation)
      }
    },
    [newConversation.rejected]: (state, action) => {
      console.log("fasfas")
    },
    [sendMessage.fulfilled]: (state, action) => {
      console.log(action.payload);
      const conver = state.conversations.find(cv => cv._id === action.payload.participants[1]);
      conver._id = action.payload._id;
    }
  },
  reducers: {
    // newConversation: (state, action) => {
    //   let participant = action.payload.participant
    //   let _id = action.payload.conversationId
    //   for (const cv of state.conversations) {
    //     if (cv._id === _id) {
    //       if (cv.visible === true) {
    //         return;
    //       } else {
    //         cv.visible = false
    //         return;
    //       }
    //     }
    //   }
    //   let newConversation = {
    //     _id,
    //     participant,
    //     messages: [],
    //     visible: true
    //   }
    //   state.conversations.push(newConversation)
    // },
    closeConversation: (state, action) => {
      let _id = action.payload._id
      let idx = state.conversations.map(cv => cv._id).indexOf(_id)
      let conversation = state.conversations[idx]
      if (conversation.participant._id === _id) {
        state.conversations.splice(idx, 1)
      } else {
        state.conversations[idx].visible = false
        state.conversations[idx].messages = []
      }
    }
  }
})

export const { closeConversation } = conversationSlice.actions

export default conversationSlice.reducer