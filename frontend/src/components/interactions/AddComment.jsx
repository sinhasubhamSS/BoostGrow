import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, fetchComments } from '../../Redux/interactionSlice';

const AddComment = ({ postId }) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Get comments and status from store
  const { commentsByPost, status } = useSelector(state => state.comments);
  const postComments = commentsByPost[postId] || {};
  const comments = postComments.comments || []; // ✅ Access nested array
  console.log(comments);
  const isLoading = postComments.status === 'loading';

  // Fetch comments when component opens
  useEffect(() => {
    if (showComments && !postComments.comments) {
      dispatch(fetchComments(postId));
    }
  }, [showComments, dispatch, postId, postComments.comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await dispatch(addComment({
        postId,
        content: newComment
      })).unwrap();

      // Refresh comments after successful addition
      dispatch(fetchComments(postId));
      setNewComment('');
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <button
        onClick={() => setShowComments(!showComments)}
        className="toggle-comments"
      >
        {showComments ? 'Hide Comments' : `Show Comments (${comments.length})`}
      </button>

      {showComments && (
        <div className="comments-container">
          {/* Loading State */}
          {isLoading && <div>Loading comments...</div>}

          {/* Comments List */}
          {!isLoading && (
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment._id} className="comment-item">
                  <strong>{comment.user?.username}</strong> {/* Changed from author to user */}
                  <p>{comment.content}</p>
                </div>
              ))}

            </div>
          )}

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
      )}
    </div>
  );
};

export default AddComment;