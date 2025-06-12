import React from 'react';
import './profilepostcard.css'; // or wherever you keep these styles

function ProfilePostCard({ post }) {
    return (
        <div className="profile-post-card">
            <img
                src={post.image}
                alt="Post"
                className="post-thumbnail"
            />

            <div className="post-overlay">
                <div className="overlay-content">
                    <div className="stat-item">
                        <span className="stat-icon">❤️</span>
                        <span className="stat-count">{post.likeCount}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">💬</span>
                        <span className="stat-count">{post.commentCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePostCard;