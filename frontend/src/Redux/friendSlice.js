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



const friendSlice = createSlice({
    name: "friend",
    initialState: {
        following: [],
        followers: [],
        mutualFriends: []
    },
    reducers: {
        addFollower: (state, action) => {
            console.log("Adding follower:", action.payload);
            if (!state.followers.includes(action.payload)) {
                state.followers.push(action.payload);
            }
            console.log("Updated followers:", state.followers);
        },
        removeFollower: (state, action) => {
            console.log("Removing follower:", action.payload);
            state.followers = state.followers.filter(id => id !== action.payload);
            console.log("Updated followers:", state.followers);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(followUser.fulfilled, (state, action) => {
                state.following.push(action.payload.userId);
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.following = state.following.filter(id => id !== action.payload.userId);
            })
            .addCase(followerandfollowing.fulfilled, (state, action) => {
                console.log("🟢 Updating Redux Store Followers & Following:", action.payload);
                state.followers = action.payload.followers;
                state.following = action.payload.following.map(user => user._id);
                console.log("🟢 Updated Followers:", state.followers);
                console.log("🟢 Updated Following:", state.following);
            });

    }
});

// ✅ Correct export
export const { addFollower, removeFollower } = friendSlice.actions;
export default friendSlice.reducer;



// const friendSlice = createSlice({
//     name: "friend",
//     initialState: {
//         following: [],
//         followers: [],
//         mutualFriends: []
//     },
//     reducers: {
//         reducers: {
//             addFollower: (state, action) => {
//                 console.log("Adding follower:", action.payload);
//                 if (!state.followers.includes(action.payload)) {
//                     state.followers.push(action.payload);
//                 }
//                 console.log("Updated followers:", state.followers);
//             },
//             removeFollower: (state, action) => {
//                 console.log("Removing follower:", action.payload);
//                 state.followers = state.followers.filter(id => id !== action.payload);
//                 console.log("Updated followers:", state.followers);
//             }
//         }


//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(followUser.fulfilled, (state, action) => {
//                 state.following.push(action.payload.userId);
//             })
//             .addCase(unfollowUser.fulfilled, (state, action) => {
//                 state.following = state.following.filter(id => id !== action.payload.userId);
//             })
//             .addCase(followerandfollowing.fulfilled, (state, action) => {
//                 state.followers = action.payload.followers;
//                 state.following = action.payload.following.map(user => user._id);
//             });
//     }
// });

// export const { addFollower, removeFollower } = friendSlice.actions;
// export default friendSlice.reducer;
