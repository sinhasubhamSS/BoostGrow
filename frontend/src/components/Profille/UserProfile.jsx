


import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import "./userprofile.css";
import FollowUnfollow from '../FriendComponent/FollowUnfollow';
import { addFollower, followerandfollowing, removeFollower, addToFollowing, removeFromFollowing, removeFromCurrentProfileFollowing, addToCurrentProfileFollowing } from '../../Redux/friendSlice';


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

    // Existing listeners for target user updates
    socket.on("follow", (data) => {
      if (data.targetUserId === userId) {
        dispatch(addFollower(data.newFollower));
      }
    });

    socket.on("unfollow", (data) => {
      if (data.targetUserId === userId) {
        dispatch(removeFollower(data.unfollowerId));
      }
    });

    // ✅ New listener for follower's following updates
    socket.on("update_profile_following", (data) => {
      // यदि current profile वही है जिसका following update होना है
      if (data.profileUserId === userId) {
        if (data.type === "follow") {
          dispatch(addToCurrentProfileFollowing(data.targetUserId));
        } else {
          dispatch(removeFromCurrentProfileFollowing(data.targetUserId));
        }
      }
    });

    return () => {
      socket.off("follow");
      socket.off("unfollow");
      socket.off("update_profile_following");
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