import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, fetchComments, pushComment } from '../../Redux/interactionSlice';
import "./addcomment.css"
import { updateCommentCount } from '../../Redux/postSlice';

const AddComment = ({ postId }) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState('');

  const { commentsByPost } = useSelector(state => state.comments);
  const socket = useSelector(state => state.socket.instance);
  const postComments = commentsByPost[postId] || {};
  const comments = postComments.comments || [];
  const isLoading = postComments.status === 'loading';

  // Fetch comments on mount
  useEffect(() => {
    if (!postComments.comments) {
      dispatch(fetchComments(postId));
    }
  }, [dispatch, postId, postComments.comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await dispatch(addComment({ postId, content: newComment })).unwrap();
      // dispatch(fetchComments(postId));
      setNewComment('');
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (incomingComment) => {
      if (incomingComment.postId === postId) {
        dispatch(pushComment(incomingComment));
        dispatch(updateCommentCount({
          postId: incomingComment.postId,
          commentCount: incomingComment.commentCount
        }));

      }
    };

    socket.on("sendComment", handleNewComment);

    return () => socket.off("sendComment", handleNewComment);
  }, [socket, postId, dispatch]);

  return (
    <div className="comments-container">
      {/* Loading State */}
      {isLoading && <div>Loading comments...</div>}

      {/* Comments List */}
      {!isLoading && comments.map(comment => (
        <div key={comment._id} className="comment-item">
          <span className="comment-author">{comment.user?.username}:</span>
          <span className="comment-text">{comment.content}</span>
        </div>
      ))}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default AddComment;
