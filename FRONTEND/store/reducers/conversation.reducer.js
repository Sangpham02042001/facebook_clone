import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance, showWarning } from '../../utils'
import path from 'path';
import { v4 } from 'uuid';

const initialState = {
  conversations: [],
  error: ''
}

export const getConversations = createAsyncThunk('/getConversations', async (data, { rejectWithValue }) => {
  let { userLoginId } = data
  try {
    const response = await axiosInstance.get(path.join('api', userLoginId, 'conversations'));
    let { conversations } = response.data
    return {
      conversations
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

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
        let conver = conversations.filter(cv => cv.participant._id == _id)[0]
        const response = await axiosInstance.get(path.join('api/conversations', conver._id));
        let { conversation } = response.data
        return {
          conversation: {
            _id: conversation._id,
            messages: conversation.messages
          }
        }
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

export const sendNewMessage = createAsyncThunk('/sendNewMessage', async (data, { getState, rejectWithValue }) => {
  try {
    let myData = {
      ...data,
      messageId: v4()
    }
    const response = await axiosInstance.post(path.join('api', data.senderId, 'conversations'), myData);
    return response.data;
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const sendMessage = createAsyncThunk('/sendMessage', async (data, { getState, rejectWithValue }) => {
  try {
    let myData = {
      ...data,
      messageId: v4()
    }
    const response = await axiosInstance.put(path.join('api', data.senderId, 'conversations'), myData);
    return response.data;
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const receviceMessage = createAsyncThunk('/receiveMessage', async (data, { getState, rejectWithValue }) => {
  try {
    let { newMessage, sender, conversationId } = data
    const conversations = getState().conversationReducer.conversations
    let idx = conversations.map(cv => cv._id).indexOf(conversationId)
    let message = {
      content: newMessage,
      sender,
      _id: v4(),
      sendAt: new Date()
    }
    if (idx >= 0) {
      let conversation = conversations[idx]
      if (conversation) {
        if (conversation.visible) {
          let newMessages = [...conversation.messages, message]
          return {
            _id: conversation._id,
            messages: newMessages
          }
        } else {
          //request
          const response = await axiosInstance.get(path.join('api/conversations', conversation._id));
          let cv = response.data.conversation
          // let lastMessage = cv.messages[cv.messages.length - 1]
          // if (lastMessage._id != message._id) {
          //   cv.messages.push(message)
          // }
          return {
            _id: cv._id,
            messages: cv.messages,
          }
        }
      }
    } else {
      // let userList = getState().userListReducer.userList
      // let idx = userList.map(user => user._id).indexOf(sender)
      return {
        // conversation: {
        //   _id: conversationId,
        //   participant: userList[idx],
        //   messages: [message],
        //   visible: true
        // }
        message: "FIXED SOON"
      }
    }
  } catch (error) {
    return rejectWithValue(error)
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
        let checkIdx = state.conversations.map(cv => cv._id).indexOf(conversation._id)
        if (checkIdx >= 0) {
          state.conversations[checkIdx].messages = conversation.messages
          state.conversations[checkIdx].visible = true
        } else {
          state.conversations.push(conversation)
        }
      }
    },
    [newConversation.rejected]: (state, action) => {
      console.log(action)
    },
    [sendNewMessage.fulfilled]: (state, action) => {
      const conver = state.conversations.find(cv => cv._id === action.payload.participants[1]);
      conver._id = action.payload._id;
      conver.messages = action.payload.messages
    },
    [sendMessage.fulfilled]: (state, action) => {
      const conver = state.conversations.find(cv => cv._id == action.payload._id);
      conver.messages.push(action.payload.messages[action.payload.messages.length - 1]);
    },
    [getConversations.pending]: (state, action) => {
      console.log('get conversations pending')
    },
    [getConversations.fulfilled]: (state, action) => {
      let { conversations } = action.payload
      if (conversations) {
        conversations = conversations.map(cv => ({
          ...cv,
          visible: false
        }))
      }
      state.conversations = conversations
    },
    [receviceMessage.fulfilled]: (state, action) => {
      if (action.payload.message) {
        console.log("fadsfsadf")
        return;
      }
      let { _id, messages } = action.payload
      let idx = state.conversations.map(cv => cv._id).indexOf(_id)
      state.conversations[idx].messages = messages
      if (!state.conversations[idx].visible) {
        state.conversations[idx].visible = true
      }
    },
    [receviceMessage.rejected]: (state, action) => {
      console.log(action.payload)
    }
  },
  reducers: {
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
    },
  }
})

export const { closeConversation } = conversationSlice.actions

export default conversationSlice.reducer