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
      let participants = action.payload.participants
      let id = action.payload.conversationId
      for (const cv of state.conversations) {
        if (cv.id === id && cv.visible === true) {
          return;
        }
      }
      let newConversation = {
        id: participants.reduce((id, userId) => id += userId + '-', ''),
        participants,
        messages: [],
        visible: true
      }
      state.conversations.push(newConversation)
    }
  }
})

export const { newConversation } = conversationSlice.actions

export default conversationSlice.reducer