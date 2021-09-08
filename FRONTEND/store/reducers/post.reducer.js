import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios.util'
import path from 'path';

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
    const response = await axiosInstance.get('/posts');

    return response.data;
})

export const addPost = createAsyncThunk('posts/addPost', async ({ title, userId, images, video }) => {
    const formData = new FormData();
    console.log(images);
    for (let key in images) {
        formData.append(`image-post-${key}`, images[key]);
    }
    
    formData.append("videos-post", video);
    formData.append("_id", nanoid());
    formData.append("article", title);
    formData.append("userId", userId);

    const response = await axiosInstance.post(path.join('posts', userId, 'post'), formData);

    return response.data;
})



export const deletePost = createAsyncThunk('posts/deletePost', async ({ userId, postId }) => {
    const response = await axiosInstance.delete(path.join('posts', userId, 'post', postId))

    return response.data;
})

export const reactPost = createAsyncThunk('posts/reactPost', async ({ userId, postId, reactType }) => {
    const data = {
        userId,
        postId,
        reactType
    }
    const response = await axiosInstance.post(path.join('posts', userId, 'interactive', postId, 'reacts'), data)

    return response.data;
})

export const addComment = createAsyncThunk('posts/addComment', async ({ userId, postId, comment }) => {
    // const formData = new FormData();
    // formData.append("postId", postId);
    // formData.append("comment", comment);
    // formData.append("userId", userId);
    const data = {
        userId, postId, comment
    }

    const response = await axiosInstance.post(path.join('posts', userId, 'interactive', postId, 'comments'), data);

    return response.data;
})

export const deleteComment = createAsyncThunk('posts/deleteComment', async ({ userId, postId, commentId }) => {
    console.log('delete')
    const response = await axiosInstance.delete(path.join('posts', userId, 'interactive', postId, 'comments', commentId));

    return response.data;
})



const posts = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        loadingPost: false,
    },
    reducers: {
        hiddenComment: (state, action) => {
            console.log(action.payload);
            const post = state.posts.find(post => post._id == action.payload.postId);
            const idx = post.comments.map(cmt => cmt._id).indexOf(action.payload.commentId);
            post.comments.splice(idx, 1);
        },
        hiddenPost: (state, action) => {
            console.log(action.payload);
            const post = state.posts.find(post => post._id == action.payload.postId);
            const idx = state.posts.indexOf(post);
            state.posts.splice(idx, 1);
        }
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
        [addPost.pending]: (state, action) => {
            console.log('Adding post');
            state.loadingPost = true;
        },
        [addPost.fulfilled]: (state, action) => {
            console.log('Data added');
            console.log(action.payload);
            state.posts.unshift(action.payload);
            state.loadingPost = false;
        },
        [addPost.rejected]: (state, action) => {
            console.log(action)
            console.log('Failed to post data');
            state.loadingPost = false;
        },
        [deletePost.pending]: (state, action) => {
            console.log('Deleting');
            state.loadingPost = true;
        },
        [deletePost.fulfilled]: (state, action) => {
            console.log('Post deleted!');
            const idx = state.posts.map(post => post._id).indexOf(action.payload._id);
            state.posts.splice(idx, 1);
            state.loadingPost = false;
        },
        [deletePost.rejected]: (state, action) => {
            console.log(action)
            console.log('Failed to delete data');
            state.loadingPost = false;
        },
        [reactPost.fulfilled]: (state, action) => {
            const post = state.posts.find(post => post._id == action.payload._id);
            post.reactList = action.payload.reactList;
        },
        [addComment.fulfilled]: (state, action) => {
            console.log('Comment added');
            console.log(action.payload);
            const post = state.posts.find(post => post._id == action.payload._id);
            post.comments = action.payload.comments;
        },
        [deleteComment.rejected]: (state, action) => {
            console.log('Delete fail');        
        },
        [deleteComment.fulfilled]: (state, action) => {
            console.log('Comment deleted');
            console.log(action.payload);
            const post = state.posts.find(post => post._id == action.payload._id);
            post.comments = action.payload.comments;
        },

    }

})



// export const postSelector = state => state.postsReducer.posts;
export const {hiddenComment, hiddenPost} = posts.actions;

export default posts.reducer;