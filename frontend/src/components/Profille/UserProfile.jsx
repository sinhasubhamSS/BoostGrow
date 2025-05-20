import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import "./userprofile.css";
import FollowUnfollow from '../FriendComponent/FollowUnfollow';
import {
  addFollower,
  followerandfollowing,
  removeFollower,
  addToCurrentProfileFollowing,
  removeFromCurrentProfileFollowing,
  removeFromSentRequests,
  addfollowing
} from '../../Redux/friendSlice';

function UserProfile({ userId }) {
  const dispatch = useDispatch();

  const otherusers = useSelector((state) => state.user.otherUsers);
  const loggedinuser = useSelector(state => state.user.loggedinuser);
  const socket = useSelector(state => state.socket.instance);

  const isOwnProfile = userId === loggedinuser?._id;
  const user = isOwnProfile ? loggedinuser : otherusers.find((u) => u._id === userId);

  const currentProfileFollowers = useSelector(state => state.friend.currentProfileFollowers);
  const currentProfileFollowing = useSelector(state => state.friend.currentProfileFollowing);

  useEffect(() => {
    if (userId) {
      dispatch(followerandfollowing(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (!socket) return;

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

    socket.on("update_profile_following", (data) => {
      if (data.profileUserId === userId) {
        if (data.type === "follow") {
          dispatch(addToCurrentProfileFollowing(data.targetUserId));
        } else {
          dispatch(removeFromCurrentProfileFollowing(data.targetUserId));
        }
      }
    });
    socket.on('follower_added', (data) => {
      console.log("userprofile follower added",data);
      if (data.newFollowerId === userId) { // सिर्फ current profile के लिए
        dispatch(addFollower(data.newFollowerId));
      }
    });

    return () => {
      socket.off("follow");
      socket.off("unfollow");
      socket.off("update_profile_following");
      socket.off('follower_added');
    };
  }, [socket, userId, dispatch]);

  if (!user) return null;

  return (
    <div className="profile_container">
      <div className="profileimage">
        <img src={user.profilePicture || "/default-avatar.png"} alt="Profile" className="image" />
      </div>

      <div className="profile_deatils">
        <div className="profile_username">
          <h2>{user.username}</h2>
          {isOwnProfile ? (
            <button className="edit_btn">Edit Profile</button>
          ) : (
            <div className="profile__actions">
              <FollowUnfollow userIdToFollow={user._id} />
              <button className="message__btn">Message</button>
            </div>
          )}
        </div>

        <div className="profile__counts">
          <p><strong>{currentProfileFollowers?.length || 0}</strong> followers</p>
          <p><strong>{currentProfileFollowing?.length || 0}</strong> following</p>
        </div>

        <p className="profile__bio">{user.bio || "No bio available"}</p>
      </div>
    </div>
  );
}

export default UserProfile;
