import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios.util'
import path from 'path';

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
    const response = await axiosInstance.get('/posts');

    return response.data;
})

export const addPost = createAsyncThunk('posts/addPost', async ({ title, userId, image }) => {
    const formData = new FormData();
    formData.append("image-post", image);
    formData.append("_id", nanoid());
    formData.append("article", title);
    formData.append("userId", userId);

    const response = await axiosInstance.post(path.join('posts', userId), formData);

    return response.data;
})

export const deletePost = createAsyncThunk('posts/deletePost', async ({ userId, postId }) => {
    const formData = new FormData();
    formData.append("image-post", image);

    const response = await axiosInstance.post(path.join('posts', userId, postId))

    return response.data;
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
        [addPost.fulfilled]: (state, action) => {
            console.log('Data added');
            console.log(action.payload);
            state.posts.unshift(action.payload);
        },
        [addPost.rejected]: (state, action) => {
            console.log(action)
            console.log('Failed to post data');
        },
        [deletePost.fulfilled]: (state, action) => {
            console.log('Deleted!');
            state.posts.splice(state.posts.indexOf(action.payload, 1));
        },
        [deletePost.rejected]: (state, action) => {
            console.log(action)
            console.log('Failed to delete data');
        },

    }

})



// export const postSelector = state => state.postsReducer.posts;
// export const {} = posts.actions;

export default posts.reducer;