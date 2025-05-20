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
export const fetchRequests = createAsyncThunk(
    "friend/fetchPendingRequests",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/api/users/friend/fetchRequests");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch pending requests");
        }
    }
);


// Accept Friend Request
export const acceptRequest = createAsyncThunk(
    "friend/acceptRequest",
    async (requestId, thunkAPI) => {
        try {
            const response = await api.post(`/api/users/friend/accept-friend-request/${requestId}`);
            return { requestId, senderId: response.data.newFollower };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to accept request");
        }
    }
);

// Reject Friend Request
export const rejectRequest = createAsyncThunk(
    "friend/rejectRequest",
    async (requestId, thunkAPI) => {
        try {
            await api.delete(`/api/users/friend/reject-friend-request/${requestId}`);
            return requestId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to reject request");
        }
    }
);
const friendSlice = createSlice({
    name: "friend",
    initialState: {
        loggedInUserFollowing: [],
        currentProfileFollowers: [],
        currentProfileFollowing: [],
        loggedInUserFollower: [],
        status: "idle",
        error: null,
        pendingRequests: [],
        sentRequests: [],
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
        addfriendRequest: (state, action) => {
            if (!state.pendingRequests.some(req => req._id === action.payload._id)) {
                state.pendingRequests.push(action.payload);
            }

        },// In your friendSlice reducers
        addfollowing: (state, action) => {
            if (!state.loggedInUserFollowing.includes(action.payload)) {
                state.loggedInUserFollowing.push(action.payload);
            }
        }
        , removeFromSentRequests: (state, action) => {
            state.sentRequests = state.sentRequests.filter(
                req => req._id !== action.payload
            );
        },



    },
    extraReducers: (builder) => {
        builder
            .addCase(followUser.pending, (state) => {
                state.status = "loading";
            })
            // In friendSlice.js - followUser.fulfilled case
            // Update the followUser.fulfilled case
            .addCase(followUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { request } = action.payload;


                if (request?.status === "pending") {
                    state.sentRequests.push({
                        _id: request._id,
                        receiver: request.receiver, // Should be the ID
                        status: request.status,
                        sender: { // From response
                            _id: request.sender._id,
                            username: request.sender.username,
                            avatar: request.sender.avatar
                        }
                    });
                }
                // Public account handling remains same
                else if (action.payload.userId) {
                    state.loggedInUserFollowing.push(action.payload.userId);
                }
            })

            // In unfollowUser.fulfilled case
            .addCase(unfollowUser.fulfilled, (state, action) => {
                const userIdToUnfollow = action.meta.arg;
                // Remove from following
                state.loggedInUserFollowing = state.loggedInUserFollowing.filter(
                    id => id !== userIdToUnfollow
                );
                // Also remove any pending requests to this user
                state.sentRequests = state.sentRequests.filter(
                    req => req.receiver !== userIdToUnfollow
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
                const { following, followers } = action.payload;
                state.loggedInUserFollowing = following.map(f => f._id);
                state.loggedInUserFollower = followers.map(f => f._id);
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.pendingRequests = action.payload.pendingRequests || [];
                state.sentRequests = action.payload.sentRequests || [];
            })

            // In friendSlice.js - acceptRequest.fulfilled case
            .addCase(acceptRequest.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { senderId } = action.payload;

                // Remove from pending requests
                state.pendingRequests = state.pendingRequests.filter(
                    req => req._id !== action.meta.arg // Use original request ID from action
                );

                // Update both users' relationships
                if (!state.loggedInUserFollower.includes(senderId)) {
                    state.loggedInUserFollower.push(senderId);
                }

            })

            // Reject Request
            // In extraReducers
            .addCase(rejectRequest.fulfilled, (state, action) => {
                const requestId = action.payload?.requestId || action.meta.arg;
                state.pendingRequests = state.pendingRequests.filter(
                    req => req._id !== requestId
                );
                state.sentRequests = state.sentRequests.filter(
                    req => req._id !== requestId
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
    removeFromCurrentProfileFollowing, addfriendRequest, addfollowing ,removeFromSentRequests
} = friendSlice.actions;

export default friendSlice.reducer;
