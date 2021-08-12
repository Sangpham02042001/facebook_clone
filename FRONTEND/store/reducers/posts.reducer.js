import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios.util'

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
    const response = await axiosInstance.get('/posts');

    return response.data;
})

export const addStatus = createAsyncThunk('posts/addStatus', async ({title, userId}) => {
    const newStatus = {
        _id: nanoid(),
        status: title,
        userId
    }

    await axiosInstance.post('/posts', newStatus);

    return newStatus;
})




const posts = createSlice({
    name: 'posts',
    initialState: {
        posts: []
    },
    reducers: {

    },
    extraReducers: {
        [getPosts.pending]: (state, action) => {
            console.log('Data is coming....')
        },
        [getPosts.fulfilled]: (state, action) => {
            console.log('Get data done');
            state.posts = action.payload;
        },
        [getPosts.rejected]: (state, action) => {
            console.log('Failed to get data');
        },
        [addStatus.fulfilled]: (state, action) => {
            console.log('Data added');
            state.posts.unshift(action.payload);
        },
        [addStatus.rejected]: (state, action) => {
            console.log('Failed to post data');
        },
    }

})



export const postsSelector = state => state.postsReducer.posts;
// export const {} = posts.actions;

export default posts.reducer;