import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// Follow User
export const followUser = createAsyncThunk(
    "friend/followUser",
    async (userIdToFollow, thunkAPI) => {
        try {
            const response = await api.post(`/api/users/friend/follow/${userIdToFollow}`);
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
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Fetching followers failed");
        }
    }
);

// My Profile - for logged-in user's own following
export const myprofile = createAsyncThunk(
    "friend/myprofile",
    async (userId, thunkAPI) => {
        try {
            const response = await api.get(`/api/users/friend/followerfollowing/${userId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Fetching followers failed");
        }
    }
);

const friendSlice = createSlice({
    name: "friend",
    initialState: {
        loggedInUserFollowing: [],
        currentProfileFollowers: [],
        currentProfileFollowing: [],
        status: "idle",
        error: null
    },
    reducers: {
        addFollower: (state, action) => {
            if (!state.currentProfileFollowers.includes(action.payload)) {
                state.currentProfileFollowers.push(action.payload);
            }
        },
        removeFollower: (state, action) => {
            state.currentProfileFollowers = state.currentProfileFollowers.filter(
                id => id !== action.payload
            );
        },
        addToCurrentProfileFollowing: (state, action) => {
            if (!state.currentProfileFollowing.includes(action.payload)) {
                state.currentProfileFollowing.push(action.payload);
            }
        },
        removeFromCurrentProfileFollowing: (state, action) => {
            state.currentProfileFollowing = state.currentProfileFollowing.filter(
                id => id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(followUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { userId } = action.payload;
                if (!state.loggedInUserFollowing.includes(userId)) {
                    state.loggedInUserFollowing.push(userId);
                }
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                const userIdToUnfollow = action.meta.arg;
                state.loggedInUserFollowing = state.loggedInUserFollowing.filter(
                    id => id !== userIdToUnfollow
                );
            })
            .addCase(followerandfollowing.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { followers, following } = action.payload;
                state.currentProfileFollowers = followers.map(f => f._id);
                state.currentProfileFollowing = following.map(f => f._id);
            })
            .addCase(myprofile.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { following } = action.payload;
                state.loggedInUserFollowing = following.map(f => f._id);
            })
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload || action.error.message;
                }
            );
    }
});

// Export Actions
export const {
    addFollower,
    removeFollower,
    addToCurrentProfileFollowing,
    removeFromCurrentProfileFollowing
} = friendSlice.actions;

export default friendSlice.reducer;
