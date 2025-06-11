
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Singlemessage from './Singlemessage';
import { addMessage, fetchMessages } from '../../Redux/messageSlice';
import "./messagelist.css";

function MessageList() {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const messages = useSelector((state) => state.message?.messages || []);
  const loggedInuser = useSelector((state) => state.user.loggedinuser);
  const socket = useSelector(state => state.socket.instance);
  // const onlineuser = useSelector(state => state.user.onlineusers);
  const lastMessageRef = useRef(null);
  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);

  // Handle real-time messaging
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket not connected!");
      return;
    }

    const handleReceiveMessage = (newMessage) => {
      console.log("📨 New Message Received:", newMessage);
      dispatch(addMessage(newMessage));
    };

    // ✅ Corrected event name
    socket.on("newMessage", handleReceiveMessage);

    return () => {
      socket.off("newMessage", handleReceiveMessage);
    };
  }, [socket, dispatch]);
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])
  return (
    <div className="message-container">
      {messages.length > 0 ? (
        messages.map((msg, index) => {
          const isSender = msg.sender?._id === loggedInuser._id;
          return (
            <div key={msg._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
              <Singlemessage msg={msg} isSender={isSender} />
            </div>
          );
        })
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );

}

export default MessageList;
//


