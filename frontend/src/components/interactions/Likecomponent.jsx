import { useState } from "react";
import api from "../../api/axiosInstance";
import { useSelector } from "react-redux";

const LikeComponent = ({ postId, likes, setLikes, liked, setLiked }) => {
  const [loading, setLoading] = useState(false);
const socket=useSelector(state=>state.socket.instance)
  const handleLikeToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await api.post(`/api/users/post/like/${postId}`);
      setLiked(res.data.liked);
      setLikes(res.data.likeCount);
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
    <button
      onClick={handleLikeToggle}
      disabled={loading}
      style={{
        fontSize: "18px",
        background: "none",
        border: "none",
        color: liked ? "red" : "gray",
        cursor: "pointer",
      }}
    >
      {liked ? "❤️" : "🤍"} {likes}
    </button>
  );
};


export default LikeComponent;
