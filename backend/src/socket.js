


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
