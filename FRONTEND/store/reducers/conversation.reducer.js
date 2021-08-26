import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  conversations: []
}



export const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  extraReducers: {
  },
  reducers: {
    newConversation: (state, action) => {
      let participant = action.payload.participant
      let _id = action.payload.conversationId
      for (const cv of state.conversations) {
        if (cv._id === _id && cv.visible === true) {
          return;
        }
      }
      let newConversation = {
        _id,
        participant,
        messages: [],
        visible: true
      }
      state.conversations.push(newConversation)
    },
    closeConversation: (state, action) => {
      let _id = action.payload._id
      let idx = state.conversations.map(cv => cv._id).indexOf(_id)
      state.conversations.splice(idx, 1);
    }
  }
})

export const { newConversation, closeConversation } = conversationSlice.actions

export default conversationSlice.reducer