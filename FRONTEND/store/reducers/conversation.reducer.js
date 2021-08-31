import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance, showWarning } from '../../utils'
import path from 'path';
import socketClient from '../../socketClient'

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

  const conversations = getState().conversationReducer.conversations
  let { _id } = data.user
  try {
    let checkIndex = conversations.map(cv => cv.participant._id).indexOf(_id)
    if (checkIndex >= 0) {
      if (conversations[checkIndex].visible) {
        showWarning("Already open")
        return { }
      } else {
        let cons = conversations.filter(cv => cv.participant._id == _id)[0]
        const response = await axiosInstance.get(path.join('api/conversations', cons._id));
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


export const receiveMessage = createAsyncThunk('/receiveMessage', async (data, { getState, rejectWithValue }) => {
  try {
    let { newMessage, sender, receiveId, conversationId, messageId } = data
    const conversations = getState().conversationReducer.conversations
    let idx = conversations.map(cv => cv._id).indexOf(conversationId)
    let message = {
      content: newMessage,
      sender,
      _id: messageId,
      sendAt: Date.now()
    }
    if (idx >= 0) {
      let conversation = conversations[idx]
      if (conversation) {
        if (conversation.visible) {
          let newMessages = [...conversation.messages, message]
          return {
            idx,
            messages: newMessages
          }
        } else {
          //request
          const response = await axiosInstance.get(path.join('api/conversations', conversation._id));
          let cv = response.data.conversation

          return {
            idx,
            messages: cv.messages,
          }
        }
      }
    } else {
      let userList = getState().userListReducer.userList
      let idx = userList.map(user => user._id).indexOf(sender)
      return {
        conversation: {
          _id: conversationId,
          participant: userList[idx],
          messages: [message],
          visible: true
        }
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
      socketClient.emit("check-conversations", {
        conversations
      })
      state.conversations = conversations
    },
    [receiveMessage.fulfilled]: (state, action) => {
      let { idx, messages, conversation } = action.payload;
      if (!conversation) {
        state.conversations[idx].messages = messages;
        state.conversations[idx].visible = true;
      } else {
        state.conversations.push(conversation);
      }
    },
    [receiveMessage.rejected]: (state, action) => {
      console.log(action.payload)
    },
  },
  reducers: {
    closeConversation: (state, action) => {
      let _id = action.payload._id
      let idx = state.conversations.map(cv => cv._id).indexOf(_id)
      let conversation = state.conversations[idx]
      if (conversation.participant._id === _id) {
        state.conversations.splice(idx, 1)
      } else {
        conversation.visible = false
        conversation.messages = [conversation.messages[conversation.messages.length - 1]]
      }
    },
    sendMessageSocket: (state, action) => {
      let { newMessage, sender, receiveId, conversationId, messageId } = action.payload;
      const conversation = state.conversations.find(cv => cv._id == conversationId);

      let message = {
        content: newMessage,
        sender,
        sendAt: Date.now(),
        _id: messageId
      }

      console.log(state.conversations);
      if (conversation) {
        conversation.messages.push(message);
      } else {
        const conver = state.conversations.find(cv => cv._id == receiveId);
        console.log(conver);
        if (conver) {
          conver._id = conversationId;
          conver.messages = [message];
        }
      }
    },
    checkConversationId: (state, action) => {
      let { newMessage, sender, receiveId, conversationId, messageId } = action.payload;
      const conversation = state.conversations.find(cv => cv.participant._id == receiveId);
      console.log(state.conversations);
      if (conversation) {
        if (conversation._id != conversationId) {
          conversation._id = conversationId;
        }
      }
    },
  }
})

export const { closeConversation, sendMessageSocket,
  checkConversationId } = conversationSlice.actions

export default conversationSlice.reducer