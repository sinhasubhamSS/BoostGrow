import React, { useState } from 'react'
import UserList from './UserList';
import "./SideBar.css"
function SideBar() {
    const[searchUser,setSearchUser]=useState("");
const handleSearchChange=(e)=>{
    setSearchUser(e.target.value);
}
  return (
    <>
        <div className="sidebar">
         {/* sidebar header */}
         <div className="sidebar__header">
            <h2>Chats</h2>
         </div>
         {/* search bar */}
         <div className="sidebar__search">
            <input type="text"
            placeholder='seach user..'
            value={searchUser}
            onChange={handleSearchChange} />
         </div>
         {/* user ka list */}
         <UserList searchUser={searchUser}/>
        </div>
    </>
  )
}

export default SideBar