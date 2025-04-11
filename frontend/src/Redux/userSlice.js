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
      console.log("bakckend respone", response.data.users);
      return response.data.users

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  })
export const messagedUsers = createAsyncThunk('users/messagedUsers', async (_, thunkAPI) => {
  try {
    console.log("reached messageduderd section");
    const response = await api.get("api/users/chat/chatusers")
    console.log("backend response of messaged user", response.data);
    return response.data.users;
  } catch (error) {
    console.log("error at line 41 messagedusers");
    return thunkAPI.rejectWithValue(error.message);
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
    onlineUsers: [],
    messagedusers: [],

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
      })
      .addCase(messagedUsers.fulfilled, (state, action) => {

        state.messagedusers = action.payload || []; // ✅ Ensure it updates state
        console.log("🟢 Redux Store Updated:", state.messagedusers); // 
      })
  },
});
export const { setselectedUser, setloggedinuser, setonlineUsers } = userSlice.actions;
export default userSlice.reducer;
