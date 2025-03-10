import React from 'react'
import MessageInput from './MessageInput'
import { useSelector } from 'react-redux'
import MessageList from './MessageList'
import "./chatwindow.css"


function Chatwindow() {
  const selectedUser = useSelector((state) => state.user.selectedUser);


  // Initialize socket connection using the userId



  return (
    <div className="chat-container">
      {!selectedUser ? (
        <div className="empty-chat">Hey! Please start a chat</div>
      ) : (
        <div className="chat-box">
          {/* Header */}
          <div className="chat-header">

            <img className='chat__avatar' src={selectedUser.ProfilePicture} />
            <h2>{selectedUser?.username}</h2>
          </div>

          {/* Message List */}
          <MessageList />
          <MessageInput />
        </div>
      )}
    </div>
  );
}

export default Chatwindow;
