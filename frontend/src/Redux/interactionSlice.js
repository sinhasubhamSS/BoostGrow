// src/redux/commentSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// ✅ Add Comment
export const addComment = createAsyncThunk("interaction/addComment", async ({ postId, content }, thunkAPI) => {
    try {
        const response = await api.post(`/api/users/post/addcomment/${postId}`, { content });
        console.log(response.data);
        return {
            postId,
            comment: response.data.comment,
            commentCount: response.data.commentCount
        };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Adding comment failed");
    }
});

// ✅ Fetch Comments
export const fetchComments = createAsyncThunk("interaction/fetchComments", async (postId, thunkAPI) => {
    try {
        const response = await api.get(`/api/users/post/getcomment/${postId}`);
        console.log(response.data.comments);
        return { postId, comments: response.data.comments };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Fetching comments failed");
    }
});

// ✅ Delete Comment
export const deleteComment = createAsyncThunk("interaction/deleteComment", async ({ postId, commentId }, thunkAPI) => {
    try {
        await api.delete(`/api/users/post/deletecomment/${commentId}`);
        return { postId, commentId };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Deleting comment failed");
    }
});

// ✅ Update Comment
export const updateComment = createAsyncThunk("interaction/updateComment", async ({ postId, commentId, formData }, thunkAPI) => {
    try {
        const response = await api.put(`/api/users/post/updatecomment/${commentId}`, formData);
        return { postId, updatedComment: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Updating comment failed");
    }
});

// ✅ Slice
// src/redux/commentSlice.js
const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        commentsByPost: {  // Proper structure: { [postId]: { comments: [], status: 'idle' } }
            // Example: 
            // 'post123': { 
            //     comments: [comment1, comment2],
            //     status: 'loaded'
            // }
        },
        status: 'idle',
        error: null
    },
    reducers: {

        pushComment: (state, action) => {
            const { postId, comment, commentCount } = action.payload;

            if (!state.commentsByPost[postId]) {
                state.commentsByPost[postId] = {
                    comments: [],
                    status: 'idle',
                    error: null
                };
            }

            state.commentsByPost[postId].comments.unshift(comment);

            // If you want to store commentCount too (optional)
            state.commentsByPost[postId].commentCount = commentCount;

        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state, action) => {
                const postId = action.meta.arg;
                if (!state.commentsByPost[postId]) {
                    state.commentsByPost[postId] = {
                        comments: [],
                        status: 'loading',
                        error: null
                    };
                } else {
                    state.commentsByPost[postId].status = 'loading';
                    state.commentsByPost[postId].error = null;
                }
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                const { postId, comments } = action.payload;
                state.commentsByPost[postId] = {
                    comments,
                    status: 'succeeded'
                };
            })

            // .addCase(fetchComments.rejected, (state, action) => {
            //     state.status = 'failed';
            //     state.error = action.payload;
            // })
            .addCase(addComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;
                if (!state.commentsByPost[postId]) {
                    state.commentsByPost[postId] = {
                        comments: [],
                        status: 'loaded'
                    };
                }
                state.commentsByPost[postId].comments.unshift(comment);
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const { postId, commentId } = action.payload;
                if (state.commentsByPost[postId]) {
                    state.commentsByPost[postId].comments =
                        state.commentsByPost[postId].comments.filter(c => c._id !== commentId);
                }
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                const { postId, updatedComment } = action.payload;
                if (state.commentsByPost[postId]) {
                    const index = state.commentsByPost[postId].comments
                        .findIndex(c => c._id === updatedComment._id);
                    if (index !== -1) {
                        state.commentsByPost[postId].comments[index] = updatedComment;
                    }
                }
            });
    }
});
export const { pushComment } = commentSlice.actions;

export default commentSlice.reducer;
