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
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      dispatch(addMessage(newMessage));
    };

    socket.on("newMessage", handleReceiveMessage);
    return () => {
      socket.off("newMessage", handleReceiveMessage);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages]);

  return (
    <div className="message-container" ref={containerRef}>
      {messages.length > 0 ? (
        messages.map((msg) => {
          const isSender = msg.sender === loggedInuser._id || msg.sender?._id === loggedInuser._id;
          return (
            <Singlemessage key={msg._id} msg={msg} isSender={isSender} />
          );
        })
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
}

export default MessageList;
