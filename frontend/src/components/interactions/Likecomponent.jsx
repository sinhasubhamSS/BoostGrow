import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../api/axiosInstance";
import { updateLikeCount } from '../../Redux/postSlice';

const LikeComponent = ({ postId, likeCount, setLikeCount, liked, setLiked }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const socket = useSelector(state => state.socket.instance);
  const currentUser = useSelector(state => state.user.user);

  const handleLikeToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await api.post(`/api/users/post/like/${postId}`);
      // Update local state
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);

    

      // Socket notification
      socket.emit("likePost", {
        postId,
        liked: res.data.liked,
        likeCount: res.data.likeCount,
      });
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLikeToggle} disabled={loading}>
      {liked ? "❤️" : "🤍"} {likeCount}
    </button>
  );
};
export default LikeComponent