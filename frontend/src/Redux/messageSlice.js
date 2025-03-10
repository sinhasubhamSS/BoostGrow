import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
//fetch message 
export const fetchMessages = createAsyncThunk("messages/fetchMessage",
    async (otherUserId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/users/chat/receive/${otherUserId}`)
            console.log("bakckend respone", response.data.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }

    }

);
export const sendMessage = createAsyncThunk("message/sendmessage",
    async ({ receiverId, message }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/users/chat/send`, { receiverId, message })
            console.log("reached here ok");
            console.log("sent message", response.data.data);
            return response.data.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || "something went error in send message")
        }
    }
)
const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        // ✅ Add message in real-time
        addMessage: (state, action) => {
            const newMessage = action.payload;

            // ✅ Ensure sender is an object
            if (typeof newMessage.sender === "string") {
                newMessage.sender = { _id: newMessage.sender };
            }

            state.messages.push(newMessage);
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = [...action.payload] || [];
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                // state.messages.push(action.payload); // New message ko store me add kar rahe hain
                const newMessage = action.payload;
                // ✅ Ensure sender is an object
                if (typeof newMessage.sender === "string") {
                    newMessage.sender = { _id: newMessage.sender };
                }
                state.messages.push(newMessage);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});
export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;







// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import api from "../api/axiosInstance";

// // Fetch messages for a specific user
// export const fetchMessages = createAsyncThunk(
//     "messages/fetchMessages",
//     async (otherUserId, { rejectWithValue }) => {
//         try {
//             const response = await api.get(`/api/users/chat/receive/${otherUserId}`);
//             console.log("Backend response:", response.data.data);
//             return response.data.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || "Something went wrong");
//         }
//     }
// );

// // Send a message to a specific user
// export const sendMessage = createAsyncThunk(
//     "messages/sendMessage",
//     async ({ receiverId, message }, { rejectWithValue }) => {
//         try {
//             const response = await api.post("/api/users/chat/send", { receiverId, message });
//             console.log("Sent message:", response.data.data);
//             return response.data.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || "Something went wrong sending the message");
//         }
//     }
// );

// const messageSlice = createSlice({
//     name: "messages",
//     initialState: {
//         messagesByUser: {}, // Store messages by other user ID
//         loading: false,
//         error: null,
//     },
//     reducers: {
//         addMessage: (state, action) => {
//             const newMessage = action.payload;
//             // Ensure sender is an object
//             if (typeof newMessage.sender === "string") {
//                 newMessage.sender = { _id: newMessage.sender };
//             }
//             // Add new message to the specific user's messages
//             const userMessages = state.messagesByUser[newMessage.receiverId] || [];
//             state.messagesByUser[newMessage.receiverId] = [...userMessages, newMessage];
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchMessages.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchMessages.fulfilled, (state, action) => {
//                 state.loading = false;
//                 // Add messages for the specific user
//                 state.messagesByUser[action.payload.receiverId] = action.payload.messages;
//             })
//             .addCase(fetchMessages.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })
//             .addCase(sendMessage.fulfilled, (state, action) => {
//                 const newMessage = action.payload;
//                 if (typeof newMessage.sender === "string") {
//                     newMessage.sender = { _id: newMessage.sender };
//                 }
//                 const userMessages = state.messagesByUser[newMessage.receiverId] || [];
//                 state.messagesByUser[newMessage.receiverId] = [...userMessages, newMessage];
//             })
//             .addCase(sendMessage.rejected, (state, action) => {
//                 state.error = action.payload;
//             });
//     },
// });

// export const { addMessage } = messageSlice.actions;
// export default messageSlice.reducer;
