import { createAsyncThunk, createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { toggleLike } from "./interactionSlice";
export const addPost = createAsyncThunk("Post/addPost",
    async (formData, thunkAPI) => {
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {
            const response = await api.post("/api/users/post/addpost", formData)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "adding post failed");
        }

    }
)
export const fetchMyPost = createAsyncThunk("Post/MyPost",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("api/users/post/my-posts")
            console.log('Full API response:', response); // Add this
            console.log('Response data:', response.data); // And this
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "fetching personal post failed");

        }
    })
export const fetchOthersPost = createAsyncThunk("Post/OthersPost", async (targetUserId, thunkAPI) => {
    try {
        const response = await api.get(`api/users/post/otheruserpost/${targetUserId}`)
        console.log("backend api response", response.data);
        return response.data

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "fetching others post failed");

    }
})
export const fetchHomeFeed = createAsyncThunk("Post/HomeFeed", async () => {
    try {
        const response = await api.get("api/users/post/home-feed")
        console.log(response.data);
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "fetching home feed post failed");

    }
})
export const deletePost = createAsyncThunk("Post/deletePost", async (postId, thunkAPI) => {
    try {
        const response = await api.delete(`api/users/post/deletepost/${postId}`)
        return { deletedPostId: postId };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "deleting post failed");
    }
})
export const editPost = createAsyncThunk("post/editPost", async ({ id, formData }, thunkAPI) => {
    try {
        console.log("befor response fromdata and id", id);
        const response = await api.put(`/api/users/post/editpost/${id}`, formData);
        console.log("Updated post data:", response.data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "editing post failed");
    }
});

const initialState = {
    loading: false,
    error: null,
    myPost: [],
    otherUserPost: [],
    homeFeed: [],

};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(addPost.fulfilled, (state, action) => {
                state.loading = false;
                //now ab new post ko top pa insert karate hai
                state.myPost.unshift(action.payload);
                state.homeFeed.unshift(action.payload);
            })

            .addCase(fetchMyPost.fulfilled, (state, action) => {
                state.loading = false;
                state.myPost = action.payload.posts;

            }
            )
            .addCase(fetchOthersPost.fulfilled, (state, action) => {
                state.loading = false;
                state.otherUserPost = action.payload.posts
            })
            .addCase(fetchHomeFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.homeFeed = action.payload.posts;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                const deletedPostId = action.payload.deletedPostId;
                state.myPost = state.myPost.filter(post => post._id !== deletedPostId)
                state.homeFeed = state.homeFeed.filter(post => post._id !== deletedPostId);
            })
            .addCase(editPost.fulfilled, (state, action) => {
                state.loading = false
                const updatedPost = action.payload.post;
                state.myPost = state.myPost.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                );
                state.homeFeed = state.homeFeed.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                );

            })
            // postSlice.js में extraReducers में जोड़ें
            // postSlice.js में
            .addCase(toggleLike.fulfilled, (state, action) => {
                const { postId, likeCount } = action.payload;

                // सभी पोस्ट लिस्ट्स को अपडेट करें
                const updatePosts = (posts) => posts.map(post =>
                    post._id === postId ? { ...post, likes: likeCount } : post
                );

                state.homeFeed = updatePosts(state.homeFeed);
                state.myPost = updatePosts(state.myPost);
                state.otherUserPost = updatePosts(state.otherUserPost);
            })
            .addMatcher(isPending, (state) => {
                state.loading = true;
                state.error = null;
            })

        // ✅ Common matcher for any rejected thunk
        .addMatcher(isRejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Something went wrong";
        });
},
});

export default postSlice.reducer;
