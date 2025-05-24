
import React, { useState } from 'react';
import "./postcard.css";
import { useDispatch } from 'react-redux';
import { deletePost } from '../../Redux/postSlice';
import AddPost from './AddPost';

function PostCard({ _id, author, image, content, likes = 0, comments = [], visibility }) {
    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deletePost(_id));
        setShowOptions(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowOptions(false);
    };

    return (
        <div className="post-card-wrapper">
            <div className="post-card">
                {/* Header Section */}
                <div className="post-header">
                    <div className="user-info">
                        <img
                            src={author?.avatar || "/default-avatar.png"}
                            alt="Avatar"
                            className="user-avatar"
                        />
                        <span className="username">{author?.username}</span>
                    </div>

                    <div className="post-controls">
                        <button
                            className="more-options"
                            onClick={() => setShowOptions(!showOptions)}
                            aria-label="More options"
                        >
                            ⋯
                        </button>

                        {showOptions && (
                            <div className="dropdown-menu">
                                <button onClick={handleEdit} className="dropdown-item">
                                    ✏️ Edit
                                </button>
                                <button onClick={handleDelete} className="dropdown-item delete">
                                    🗑️ Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Post Image Section */}
                <div className="post-media">
                    <img
                        src={image}
                        alt="Post"
                        className="post-image"
                    />
                </div>

                {/* Action Buttons Section */}
                <div className="post-actions">
                    <div className="action-buttons">
                        <button className="like-btn">🤍</button>
                        <button className="comment-btn">💬</button>
                        <button className="share-btn">↗️</button>
                    </div>
                    <button className="save-btn">🔖</button>
                </div>

                {/* Post Details Section */}
                <div className="post-details">
                    <p className="likes">{likes.toLocaleString()} {likes === 1 ? "like" : "likes"}</p>
                    <p className="caption">
                        <span className="caption-username">{author?.username}</span> {content}
                    </p>
                    {comments.length > 0 && (
                        <p className="comment-count">View all {comments.length} {comments.length === 1 ? "comment" : "comments"}</p>
                    )}
                </div>

                {isEditing && (
                    <AddPost
                        onClose={() => setIsEditing(false)}
                        postToEdit={{
                            _id,
                            author,
                            content,
                            postImage: image,
                            visibility,
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default PostCard;