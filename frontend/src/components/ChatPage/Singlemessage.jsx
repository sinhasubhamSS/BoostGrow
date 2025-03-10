import React from 'react'
import "./singlemessage.css"
function Singlemessage({ msg, isSender }) {

  if (!msg) {
    return null;
  }

  const formattedTime = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
    : 'Unknown Time';

  return (
    <>
      <div className={`message__wrapper ${isSender ? "sent" : "received"}`}>

        <div className="message__box">
          <p>{msg?.message || 'Empty message'}</p>
          <span className="message__time">{formattedTime}</span>

        </div>
      </div>
    </>
  )
}

export default Singlemessage



