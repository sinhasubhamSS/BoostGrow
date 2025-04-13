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
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(followUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                const userIdToFollow = action.meta.arg;
                if (!state.loggedInUserFollowing.includes(userIdToFollow)) {
                    state.loggedInUserFollowing.push(userIdToFollow);
                }
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                const userIdToUnfollow = action.meta.arg;
                state.loggedInUserFollowing = state.loggedInUserFollowing.filter(
                    id => id !== userIdToUnfollow
                );
            })
            // .addCase(followerandfollowing.fulfilled, (state, action) => {
            //     state.status = "succeeded";
            //     const { followers, following } = action.payload;
            //     state.currentProfileFollowers = followers;
            //     state.currentProfileFollowing = following.map(user => user._id);
            // })
            .addCase(followerandfollowing.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { followers, following } = action.payload;

                // Followers को IDs में बदलें
                state.currentProfileFollowers = followers.map(follower => follower._id);

                // Following को IDs में बदलें
                state.currentProfileFollowing = following.map(user => user._id);
            })

            .addCase(myprofile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.loggedInUserFollowing = action.payload.following.map(
                    user => user._id
                );
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