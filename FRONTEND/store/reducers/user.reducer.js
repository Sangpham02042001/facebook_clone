import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { axiosInstance } from '../../utils/axios.util'

const initialState = {
  user: {},
  error: null,
  authenticated: false,
  loading: true
}

export const signin = createAsyncThunk('user/signin', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/auth/signin', {
      email, password
    });
    if (response.status === 200) {
      console.log(response.data)
      window.localStorage.setItem('user', JSON.stringify(response.data))
      return {
        user: response.data
      }
    }
  } catch (error) {
    let { data } = error.response
    if (data && data.error) {
      return rejectWithValue(data)
    }
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    isAuthenticated: (state) => {
      const user = localStorage.getItem('user')
      if (user) {
        state.user = JSON.parse(user)
        state.authenticated = true;
      }
    },
    signout: (state) => {
      state.user = {}
      state.authenticated = false
      localStorage.removeItem('user')
    }
  },
  extraReducers: {
    [signin.pending]: (state, action) => {
      state.loading = true
    },
    [signin.fulfilled]: (state, action) => {
      state.loading = false
      state.authenticated = true
      state.user = action.payload.user
    },
    [signin.rejected]: (state, action) => {
      console.log(action)
      state.error = action.payload.error
      state.loading = false
    }
  }
})

export const { isAuthenticated, signout } = userSlice.actions

export default userSlice.reducer