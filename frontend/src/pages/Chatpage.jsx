import React, { useState } from 'react'

import "./pagescss/chatpage.css"
import SideBar from '../components/ChatPage/SideBar'
import Chatwindow from '../components/ChatPage/Chatwindow'
import useSocket from '../services/Socket'

function Chatpage() {
  useSocket()
  return (
    <>
      <div className="chatpage">
        <div className="sidebar__section"> <SideBar/></div>
        <div className="message__section"><Chatwindow/></div>
      </div>

    </>
  )
}

export default Chatpage