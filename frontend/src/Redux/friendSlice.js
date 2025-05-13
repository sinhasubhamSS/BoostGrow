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
        }
        catch (error) {
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
            console.log("myfollowing ka profile  ka data", response.data);
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Fetching followers failed");
        }
    }
);

export const acceptFriendRequest = createAsyncThunk("friend/acceptRequest",
    async ({ requestId, senderId }, thunkAPI) => {
        try {
console.log(requestId,"this was requestid",senderId,"this was senderid")
            const response = await api.post("/api/users/friend/accept-friend-request", { requestId, senderId })
            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    })
export const declineRequest = createAsyncThunk(
    "friend/declineRequest",
    async (requestId, thunkAPI) => {
        try {
            const response = await api.delete("/api/users/friend/reject-friend-request", { requestId });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
const friendSlice = createSlice({
    name: "friend",
    initialState: {
        loggedInUserFollowing: [],
        currentProfileFollowers: [],
        currentProfileFollowing: [],
        friendRequests: [],
        sentRequests: [],
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
        ,
        setFriendRequests: (state, action) => {
            state.friendRequests = action.payload;
        },
        setSentRequests: (state, action) => {
            state.sentRequests = action.payload;
        },
        addSentRequest: (state, action) => {
            state.sentRequests.push(action.payload);
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
                const { requestId, userId } = action.payload;
                if (requestId) {
                    // Add to sentRequests
                    state.sentRequests.push({
                        _id: requestId,
                        receiver: userIdToFollow,
                        status: "pending"
                    });
                } else if (userId) {
                    // Add to following
                    if (!state.loggedInUserFollowing.includes(userId)) {
                        state.loggedInUserFollowing.push(userId);
                    }
                }
            })

            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                const userIdToUnfollow = action.meta.arg;
                state.loggedInUserFollowing = state.loggedInUserFollowing.filter(
                    id => id !== userIdToUnfollow
                );
                state.sentRequests = state.sentRequests.filter(
                    req => req.receiver !== userIdToUnfollow
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
                const { following, friendRequests, sentRequests = [], } = action.payload;
                state.loggedInUserFollowing = following.map(user => user._id);
                state.friendRequests = friendRequests.map(request => ({
                    _id: request._id,
                    sender: request.sender,
                    status: request.status
                }));
                state.sentRequests = sentRequests.map(request => ({
                    _id: request._id,
                    receiver: request.receiver?._id,
                    status: request.status
                }));
            })

            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                const { requestId, senderId } = action.meta.arg;
                state.friendRequests = state.friendRequests.filter(
                    request => request._id !== requestId
                );
                state.loggedInUserFollowing.push(senderId);
            })
            .addCase(declineRequest.fulfilled, (state, action) => {
                const requestId = action.meta.arg; // ✅ सीधे access करें
                state.friendRequests = state.friendRequests.filter(
                    request => request._id !== requestId
                );
            })
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload || action.error.message;
                }
            )
    }
});

// Export Actions
export const {
    addFollower,
    removeFollower,
    addToCurrentProfileFollowing,
    removeFromCurrentProfileFollowing, setFriendRequests, setSentRequests,

} = friendSlice.actions;

export default friendSlice.reducer;