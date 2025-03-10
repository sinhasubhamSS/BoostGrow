import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: { instance: null }, // ✅ Initial state
  reducers: {
    setSocket: (state, action) => {
      state.instance = action.payload;
    },
    removeSocket: (state) => {
      state.instance = null;
    }
  }
});

export const { setSocket, removeSocket } = socketSlice.actions;
export default socketSlice.reducer;
