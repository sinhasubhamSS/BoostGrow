import React from 'react';
import "./postcard.css";

function PostCard({ author, image, content, likes = 0, comments = [] }) {
    return (
        <div className="post-card-wrapper">
            <div className="post-card">
                {/* Header with user info */}
                <div className="post-header">
                    <div className="user-info">
                        <img 
                            src={author?.avatar || "/default-avatar.png"} 
                            alt="Avatar" 
                            className="user-avatar" 
                        />
                        <span className="username">{author?.username}</span>
                    </div>
                    <button className="more-options">⋯</button>
                </div>

                {/* Post image */}
                <div className="post-media">
                    <img 
                        src={image} 
                        alt="Post" 
                        className="post-image" 
                    />
                </div>

                {/* Action buttons */}
                <div className="post-actions">
                    <div className="action-buttons">
                        <button className="like-btn">🤍</button>
                        <button className="comment-btn">💬</button>
                        <button className="share-btn">↗️</button>
                    </div>
                    <button className="save-btn">🔖</button>
                </div>

                {/* Likes and caption */}
                <div className="post-details">
                    <p className="likes">{likes.toLocaleString()} {likes === 1 ? "like" : "likes"}</p>
                    <p className="caption">
                        <span className="caption-username">{author?.username}</span> {content}
                    </p>
                    {comments.length > 0 && (
                        <p className="comment-count">View all {comments.length} {comments.length === 1 ? "comment" : "comments"}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostCard;