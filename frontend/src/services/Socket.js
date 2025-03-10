import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { removeSocket, setSocket } from "../Redux/socketSlice";
import { setonlineUsers } from "../Redux/userSlice";

const SOCKET_URL = "http://localhost:3000";

const useSocket = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.loggedinuser?._id);
  const socket = useSelector(state => state.socket.instance);

  useEffect(() => {
    if (!userId || socket) return; // ✅ Socket agar already exist kare toh dobara connect mat karo

    const newSocket = io(SOCKET_URL, {
      auth: { userId },
      transports: ["websocket"],
      withCredentials: true,
    });

    dispatch(setSocket(newSocket)); // ✅ Redux me store karo

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (users) => {
      console.log("👥 Online Users:", users);
      dispatch(setonlineUsers(users));
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err);
    });

    return () => {
      console.log("🔴 Disconnecting socket...");
      newSocket.disconnect();
      dispatch(removeSocket()); // ✅ Redux se remove karo
    };
  }, [userId, dispatch]); // ❌ socket ko dependencies me mat daalo

  return socket;
};

export default useSocket;
