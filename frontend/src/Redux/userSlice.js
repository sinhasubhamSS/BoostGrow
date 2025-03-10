import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
export const loginUser = createAsyncThunk('user/loginuser',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/api/users/login", userData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  })
export const logoutUser = createAsyncThunk("user/logoutUser",
  async (_, thunkAPI) => {
    try {
      await api.post("api/users/logout", {})
      return null;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Logout Failed")

    }
  }
)
export const fetchUsers = createAsyncThunk('users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/api/users/getotheruser")
      return response.data.users

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  })
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    otherUsers: [],
    selectedUser: null,
    loggedinuser: null,

  },
  reducers: {
    setloggedinuser: (state, action) => {
      state.loggedinuser = action.payload;

    },
    setselectedUser: (state, action) => {
      state.selectedUser = action.payload;

    },
    setonlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loggedinuser = action.payload

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loggedinuser = null;
        state.selectedUser = null;
        state.user = null;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.otherUsers = action.payload; // Other users ko store mein set karega
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setselectedUser, setloggedinuser, setonlineUsers } = userSlice.actions;
export default userSlice.reducer;
