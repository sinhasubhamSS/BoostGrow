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
import toast from 'react-hot-toast';
import { fetchMyPost, fetchOthersPost } from '../../Redux/postSlice';
function UserProfile({ userId }) {
  const dispatch = useDispatch();

  const otherusers = useSelector((state) => state.user.otherUsers);
  const loggedinuser = useSelector(state => state.user.loggedinuser);
  const socket = useSelector(state => state.socket.instance);

  const isOwnProfile = userId === loggedinuser?._id;
  const user = isOwnProfile ? loggedinuser : otherusers.find((u) => u._id === userId);

  const currentProfileFollowers = useSelector(state => state.friend.currentProfileFollowers);
  const currentProfileFollowing = useSelector(state => state.friend.currentProfileFollowing);
  //post
  const myPosts = useSelector(state => state.post.myPost);
  const otherUserPosts = useSelector(state => state.post.otherUserPost)
  const postsToShow = isOwnProfile ? myPosts : otherUserPosts;

  useEffect(() => {
    if (!userId) return;

    if (isOwnProfile) {
      dispatch(fetchMyPost()); // apne posts

      ;
    } else {
      dispatch(fetchOthersPost(userId)); // other user ke posts
      console.log("i will do later on ");
    }
  }, [userId, dispatch, isOwnProfile]);

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
    socket.on("new_follower_added", ({ followerId }) => {
      dispatch(addFollower(followerId));  // receiver's perspective
    });
    socket.on("request_accepted", (data) => {
      console.log("Request accepted event received:", data);

      // ✅ Sender's perspective: I'm viewing the profile I just got accepted into
      if (data.senderId === loggedinuser?._id && data.targetUserId === userId) {
        dispatch(addFollower(data.senderId)); // Sender now sees themself in target's followers
        dispatch(removeFromSentRequests(data.requestId)); // Clean up local state
        dispatch(addfollowing(data.targetUserId)); // Update my following list
      }
    });
    socket.on("request_rejected", (data) => {
      console.log("Request rejected by:", data.receiverId);

      dispatch(removeFromSentRequests(data.requestId));

      toast("Your friend request was declined.");

    });
    return () => {
      socket.off("follow");
      socket.off("unfollow");
      socket.off("update_profile_following");
      socket.off("new_follower_added")
      socket.off("request_rejected");
    };
  }, [socket, userId, dispatch]);

  if (!user) return null;

  return (
    <div className="profile_container">
      <div className="profile_top">
        <div className="profileimage">
          <img
            src={user.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="image"
          />
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
            <div className="count">
              <span className="number">{currentProfileFollowers?.length || 0}</span>
              <span className="label">Followers</span>
            </div>
            <div className="count">
              <span className="number">{currentProfileFollowing?.length || 0}</span>
              <span className="label">Following</span>
            </div>
          </div>

        </div>
      </div>

      {/* ✅ Bio below the full profile section */}
      <p className="profile__bio">{user.bio || "No bio available"}</p>

      {/* ✅ Divider */}
      <hr className="profile_divider" />

      {/* ✅ Posts Grid stays inside profile_container */}
      <div className="profile_posts_grid">
        {postsToShow.length > 0 ? (
          postsToShow.map(post => (
            <div key={post._id} className="post_card">
              <img src={post.image} alt="post" />
            </div>
          ))
        ) : (
          <p> no posts</p>
        )}

      </div>
    </div>

  );
}

export default UserProfile;
