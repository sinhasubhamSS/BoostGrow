import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const toggleLike = createAsyncThunk("interaction/toggleLike", async (postId, thunkAPI) => {
    try {
        console.log(postId);
        const response = await api.post(`/api/users/interaction/like/${postId}`);
        console.log(response.data);
        return { postId, ...response.data };



    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "toggle like failed");
    }
})


const initialState = {
    likeStatus: {}, // { [postId]: { liked: true/false, likeCount: number } }
    loading: false,
    error: null,
}
const interaction = createSlice({
    name: "interaction",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleLike.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                const { postId, liked, likeCount } = action.payload;
                state.likeStatus[postId] = { liked, likeCount };

            })
            .addCase(toggleLike.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            });
    },
})
export default interaction.reducer;