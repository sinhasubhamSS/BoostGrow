// import { Server } from "socket.io";
// import http from "http";
// import { app } from "../app.js"; // Ensure app is imported


// const server = http.createServer(app);

// const users = new Map(); // Holds userId to socketId mapping

// const getReceiverSocketId = (receiverId) => {
//     return users.get(receiverId) || null; // 🛠️ Return `null` if user not found
// };
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST'],
//         credentials: true,
//     }
// });

// io.on("connection", (socket) => {
//     console.log("NEW User Connected: lin same", socket.id);

//     // Retrieve userId from handshake authentication data
//     const userId = socket.handshake.auth?.userId;
//     // console.log("🔍 Checking userId from handshake.auth:", userId);

//     if (userId) {
//         if (users.has(userId)) {
//             // console.log("🔄 Removing old socket for user:", userId);
//             users.delete(userId);
//         }
//         users.set(userId, socket.id);
//         // console.log("✅ User stored in map:", users);

//     } else {
//         console.log("❌ UserId missing in handshake.auth");
//     }
//     // console.log("🗂 Current Users Map:", users);

//     // Handling 'sendMessage' event
//     socket.on("sendMessage", (messageData) => {
//         // console.log("📩 Message received in backend:", messageData);
//         // console.log("🔍 Receiver Socket ID Fetched:", users.get(messageData.receiverId));
//         if (!messageData) {
//             console.log("❌ Error: messageData is undefined");
//             return;
//         }
//         console.log("🔍server received  in messageData:", messageData);
//         const receiverSocketId = users.get(messageData.receiverId); // Get the receiver's socket ID
//         console.log("🔍 Receiver Socket ID Fetched:", receiverSocketId);
//         if (receiverSocketId) {
//             // console.log("Receiver found with Socket ID:", receiverSocketId);
//             // Emit message to the receiver's socket
//             io.to(receiverSocketId).emit("receiveMessage", messageData);
//             // console.log("Message sent to Receiver:", receiverSocketId);
//         } else {
//             console.log("Receiver not connected:", messageData.receiverId);
//         }
//     });

//     // Handling disconnection
//     socket.on("disconnect", () => {
//         const userId = socket.handshake.auth?.userId;
//         if (userId) {
//             users.delete(userId);  // Remove user from map directly using userId
//         }
//         console.log("📉 Updated Users Map:", users);
//     });
// });

// export { server, io, getReceiverSocketId };


// import { Server } from "socket.io";
// import http from "http";
// import { app } from "../app.js"; // Ensure app is imported

// const server = http.createServer(app);
// const users = new Map(); // Holds userId to socketId mapping

// export const getReceiverSocketId = (receiverId) => {
//     return users.get(receiverId) || null; // 🛠️ Return `null` if user not found
// };

// export const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST'],
//         credentials: true,
//     }
// });

// io.on("connection", (socket) => {
//     console.log("NEW User Connected:", socket.id);

//     const userId = socket.handshake.auth?.userId;
//     if (userId) {
//         users.set(userId, socket.id);
//     } else {
//         console.log("❌ UserId missing in handshake.auth");
//     }

//     socket.on("disconnect", () => {
//         console.log("User Disconnected:", socket.id);
//         users.forEach((value, key) => {
//             if (value === socket.id) {
//                 users.delete(key);
//             }
//         });
//     });
// });
// export { server };





//socket io is a real time instant messaging ok.
import { Server } from "socket.io";
import http from "http";
import { app } from "../app.js";

const server = http.createServer(app);
const userSocketMap = {};

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId] || null; // ✅ Agar undefined ho toh null return kare
};

io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    const userId = socket.handshake.auth?.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`🟢 Stored user ${userId} with socket ID: ${socket.id}`);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);

        // ✅ Correct way to find userId before deleting
        const disconnectedUserId = Object.keys(userSocketMap).find(
            (key) => userSocketMap[key] === socket.id
        );

        if (disconnectedUserId) {
            delete userSocketMap[disconnectedUserId];
            console.log(`🗑️ Removed user ${disconnectedUserId} from userSocketMap`);
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { server, io };
