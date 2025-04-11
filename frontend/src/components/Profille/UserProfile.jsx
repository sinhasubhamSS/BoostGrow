


import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import "./userprofile.css";
import FollowUnfollow from '../FriendComponent/FollowUnfollow';
import { addFollower, followerandfollowing, removeFollower, addToFollowing, removeFromFollowing } from '../../Redux/friendSlice';


function UserProfile({ userId }) {
  const otherusers = useSelector((state) => state.user.otherUsers)
  const user = otherusers.find((u) => u._id === userId);
  const loggedInUserId = useSelector((state) => state.user.loggedinuser)
  const socket = useSelector(state => state.socket.instance)
  const dispatch = useDispatch();
  const currentProfileFollowers = useSelector(state => state.friend.currentProfileFollowers);
  const currentProfileFollowing = useSelector(state => state.friend.currentProfileFollowing);
  console.log(user);
  if (!user) {
    return <h2 className="text-center">User Not Found</h2>;
  }
  useEffect(() => {
    if (userId) {
      dispatch(followerandfollowing(userId)); // You need to import this action
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (!socket) return;

    // Follow Event
    socket.on("follow", (data) => {
      console.log("Follow event received:", data);
      if (data.targetUserId === userId) { // सिर्फ current profile के updates
        // dispatch(followerandfollowing(userId));
        dispatch(addFollower(data.newFollower));
        // ✅ Check Redux update after delay
      }
      if (data.loggedInUserId === loggedInUserId) {
        dispatch(addToFollowing(data.targetUserId)); // ✅ Directly use action
      }
    });

    // Unfollow Event
    socket.on("unfollow", (data) => {
      console.log("Unfollow event received:", data);
      if (data.targetUserId === userId) {
        // dispatch(followerandfollowing(userId));
        dispatch(removeFollower(data.unfollowerId));
      }
      if (data.loggedInUserId === loggedInUserId) {
        dispatch(removeFromFollowing(data.targetUserId)); // ✅ Directly use action
      }
    });

    return () => {
      socket.off("follow");
      socket.off("unfollow");
    };
  }, [socket, userId, dispatch]);

  return (
    <>
      <div className="profile_container">
        <div className="profileimage">
          <img src={user.profilePicture || "/default-avatar.png"} alt="Profile" className="image" />
        </div>
        <div className="profile_deatils">
          <div className="profile_username">
            <h2>{user.username}</h2>
          </div>
          {/* buttons */}
          <div className="profile_buttons">{loggedInUserId !== user._id && (
            <div className="profile_action">
              <FollowUnfollow userIdToFollow={user._id} />
              <button className="message_btn">Message</button>
            </div>
          )}</div>


        </div>
        {/* followers aur following */}
        <div className="profile_counts">
          <p><strong>{currentProfileFollowers?.length || 0}</strong>followers</p>
          <p><strong>{currentProfileFollowing?.length || 0}</strong>following</p>
        </div>
        <p className="profile__bio">{user.bio || "No bio available"}</p>
      </div>
    </>
  )
}

export default UserProfile;