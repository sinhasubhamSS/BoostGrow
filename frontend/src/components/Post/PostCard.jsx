
import React, { useEffect, useState } from 'react';
import "./postcard.css";
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../../Redux/postSlice';
import AddPost from './AddPost';
import LikeComponent from '../interactions/Likecomponent';
import api from '../../api/axiosInstance';
import AddComment from '../interactions/AddComment';



function PostCard({
    _id,
    author,
    content,
    image,
    likeCount: initialLikeCount,
    commentCount,
    visibility
}) {
    const dispatch = useDispatch();
    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);

    // Current user data
    const currentUser = useSelector(state => state.user.user);

    // Fetch like status on mount
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const res = await api.get(`/api/users/post/like/${_id}`);
                setLiked(res.data.liked);
            } catch (error) {
                console.error("Error fetching like status:", error);
            }
        };
        fetchLikeStatus();
    }, [_id]);

    // Update like count when prop changes
    useEffect(() => {
        setLikeCount(initialLikeCount);
    }, [initialLikeCount]);

    // Handle post deletion
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            dispatch(deletePost(_id));
        }
        setShowOptions(false);
    };

    // Handle edit post
    const handleEdit = () => {
        setIsEditing(true);
        setShowOptions(false);
    };

    return (
        <div className="post-card">
            {/* Post Header */}
            <div className="post-header">
                <div className="user-info">
                    <img
                        src={author?.avatar || "/default-avatar.png"}
                        alt="User Avatar"
                        className="user-avatar"
                    />
                    <div className="user-details">
                        <h3 className="username">{author?.username}</h3>
                        <p className="post-visibility">{visibility}</p>
                    </div>
                </div>

                {/* Options Dropdown */}
                {currentUser?._id === author?._id && (
                    <div className="post-options">
                        <button
                            className="options-btn"
                            onClick={() => setShowOptions(!showOptions)}
                        >
                            ⋯
                        </button>

                        {showOptions && (
                            <div className="options-dropdown">
                                <button onClick={handleEdit} className="edit-btn">
                                    Edit
                                </button>
                                <button onClick={handleDelete} className="delete-btn">
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div className="post-content">
                {content && <p className="post-text">{content}</p>}
                {image && (
                    <img
                        src={image}
                        alt="Post"
                        className="post-image"
                    />
                )}
            </div>

            {/* Post Stats and Actions */}
            <div className="post-actions">
                <div className="stats-container">
                    <span className="like-count">{likeCount} likes</span>
                    <span className="comment-count">{commentCount} comments</span>
                </div>

                <div className="action-buttons">
                    <LikeComponent
                        postId={_id}
                        liked={liked}
                        setLiked={setLiked}
                        likeCount={likeCount}
                        setLikeCount={setLikeCount}
                    />

                    <button
                        className="comment-btn"
                        onClick={() => setShowComments(!showComments)}
                    >
                        💬 
                    </button>
                </div>

                {/* Comments Section */}
                {showComments && <AddComment postId={_id} />}
            </div>

            {/* Edit Post Modal */}
            {isEditing && (
                <AddPost
                    onClose={() => setIsEditing(false)}
                    postToEdit={{
                        _id,
                        content,
                        image,
                        visibility
                    }}
                />
            )}
        </div>
    );
}

export default PostCard;