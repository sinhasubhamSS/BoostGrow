import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";


// Follow User
export const followUser = createAsyncThunk(
    "friend/followUser",
    async (userIdToFollow, thunkAPI) => {
        try {
            console.log("Reached here with userId:", userIdToFollow);
            const response = await api.post(`/api/users/friend/follow/${userIdToFollow}`);
            console.log("followuserka data", response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Following failed");
        }
    }
);

// Unfollow User
export const unfollowUser = createAsyncThunk(
    "friend/unfollowUser",
    async (userIdToUnfollow, thunkAPI) => {
        try {
            const response = await api.delete(`/api/users/friend/unfollow/${userIdToUnfollow}`);
            console.log("unfollow user ka data", response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Unfollowing failed");
        }
    }
);

// Fetch Followers & Following
export const followerandfollowing = createAsyncThunk(
    "friend/followerandfollowing",
    async (userId, thunkAPI) => {
        try {
            const response = await api.get(`/api/users/friend/followerfollowing/${userId}`);
            console.log("followerandfollowing ka data", response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Fetching followers failed");
        }
    }
);
export const myprofile = createAsyncThunk(
    "friend/myprofile",
    async (userId, thunkAPI) => {
        try {
            const response = await api.get(`/api/users/friend/followerfollowing/${userId}`);
            console.log("myfollowing  ka data", response.data);
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Fetching followers failed");
        }
    }
);

// friendSlice.js
const friendSlice = createSlice({
    name: "friend",
    initialState: {
        loggedInUserFollowing: [],    // Users the logged-in user follows
        currentProfileFollowers: [],   // Followers of the viewed profile
        currentProfileFollowing: []    // Users the viewed profile follows
    },
    reducers: {
        addFollower: (state, action) => {
            if (!state.currentProfileFollowers.includes(action.payload)) {
                state.currentProfileFollowers.push(action.payload);
            }
        },
        removeFollower: (state, action) => {
            state.currentProfileFollowers = state.currentProfileFollowers.filter(id => id !== action.payload);
        },
        // Add reducers to update loggedInUserFollowing via socket if needed
        updateLoggedInFollowing: (state, action) => {
            state.loggedInUserFollowing = action.payload.following;
        }
    },
    extraReducers: (builder) => {
        builder
            // Update followUser.fulfilled
            .addCase(followUser.fulfilled, (state, action) => {
                const userIdToFollow = action.meta.arg;
                if (!state.loggedInUserFollowing.includes(userIdToFollow)) {
                    state.loggedInUserFollowing.push(userIdToFollow);
                }
            })

            // Update unfollowUser.fulfilled
            .addCase(unfollowUser.fulfilled, (state, action) => {
                const userIdToUnfollow = action.meta.arg;
                state.loggedInUserFollowing = state.loggedInUserFollowing.filter(
                    id => id !== userIdToUnfollow
                );
            })
            .addCase(followerandfollowing.fulfilled, (state, action) => {
                const { followers, following } = action.payload;

                state.currentProfileFollowers = followers;
                state.currentProfileFollowing = following.map(user => user._id);



            })
            .addCase(myprofile.fulfilled, (state, action) => {
                state.loggedInUserFollowing = action.payload.following.map(user => user._id);

            });


    }
});
export const { addFollower, removeFollower } = friendSlice.actions;
export default friendSlice.reducer;
