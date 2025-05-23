import { createAsyncThunk, createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";


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
            .addMatcher(isPending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // ✅ Common matcher for any rejected thunk
            .addMatcher(isRejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export default postSlice.reducer;
