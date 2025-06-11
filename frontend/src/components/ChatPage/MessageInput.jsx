
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../Redux/messageSlice";
import "./messageinput.css";

function MessageInput() {
  const [messageText, setMessageText] = useState("");
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const dispatch = useDispatch();
  // const socket = useSelector((state)=>state.socket.socket);
  const socket = useSelector(state => state.socket.instance);

  // 🛠 Handle message sending
  const handlesendmessage = () => {
    if (messageText.trim() !== "" && selectedUser?._id) {
      const messageData = {
        receiverId: selectedUser._id,
        message: messageText,
        createdAt: new Date()
      };

      console.log("Sending message: ", messageData);

      // ✅ Fix: receiverId aur message ko correct tarike se pass karna
      if (socket) {
        console.log("📤 Message sendin inside mesageinput socket:", messageData);
        socket.emit("sendMessage", messageData);

      } else {
        console.log("❌ Socket not connected yet!");
      }
      // Redux me bhi message update karein
      dispatch(sendMessage(messageData));
      // 🧹 Input field clear karein
      setMessageText("");
    }
  };

  return (
    <div className="messageinput">
      <input
        type="text"
        placeholder="Type your message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button className="snd__btn" onClick={handlesendmessage}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;
