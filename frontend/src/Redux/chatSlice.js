import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../api/axiosInstance";
export const followUser = createAsyncThunk("chat/followUser", async (userId, thunkAPI) => {
    try {
        const response = await api.post(`/api/users/follow/${userId}`)
        console.log(response);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "following failed");
    }
}
)
export const unfollowUser = createAsyncThunk("chat/unfollowUser", async (userId, thunkAPI) => {
    try {
        const response = await api.delete(`/api/users/follow/${userId}`)
        console.log(response);
        return response.data
    } catch (error) {

    }
})



const chatSlice = createSlice({
    name: "chat",
    initialState: {
        following: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(followUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.loading = false;
                state.following.push(action.payload); // Assuming API returns updated following list
            })
            .addCase(followUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Unfollow User
            .addCase(unfollowUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.loading = false;
                state.following = state.following.filter(user => user._id !== action.payload.userId);
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

})
export default chatSlice.reducer;
