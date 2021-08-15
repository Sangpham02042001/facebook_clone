import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios.util'

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
    const response = await axiosInstance.get('/posts');

    return response.data;
})

export const addPost = createAsyncThunk('posts/addPost', async ({ title, userId, image }) => {
    const formData = new FormData();
    formData.append("image-post", image);

    const response = await axiosInstance.post('/posts', formData, {
        params: {
            metaData: {
                _id: nanoid(),
                article: title,
                userId,
            }
        }
    });

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
            state.posts.unshift(action.payload);
        },
        [addPost.rejected]: (state, action) => {
            console.log(action)
            console.log('Failed to post data');
        },

    }

})



// export const postSelector = state => state.postsReducer.posts;
// export const {} = posts.actions;

export default posts.reducer;