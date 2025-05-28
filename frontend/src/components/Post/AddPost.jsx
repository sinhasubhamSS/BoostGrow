import React, { useState, useEffect } from 'react';
import { addPost, editPost } from '../../Redux/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import "./addpost.css";

function AddPost({ onClose, postToEdit = null }) {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [visibility, setVisibility] = useState("public");
    const [imagePreview, setImagePreview] = useState(null);
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.post);

    // Initialize state when editing
    useEffect(() => {
        if (postToEdit) {
            setContent(postToEdit.content || "");
            setVisibility(postToEdit.visibility || "public");
            setImagePreview(postToEdit.postImage || null);
        }
    }, [postToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // CLOSE IMMEDIATELY

        const formData = new FormData();
        formData.append('content', content);
        formData.append('visibility', visibility);
        if (image) formData.append('postImage', image);

        try {
            if (postToEdit) {
                await dispatch(editPost({
                    id: postToEdit._id,
                    formData,
                    originalImage: postToEdit.postImage
                })).unwrap();
            } else {
                await dispatch(addPost(formData)).unwrap();
            }
            onClose();
        } catch (error) {
            console.error("Post failed:", error);
            // You can consider bringing the form back if needed
        }
    };



    const handleClose = () => {
        setContent('');
        setImage(null);
        setImagePreview(null);
        setVisibility('public');
        onClose();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            // Restore original image when removing new image
            setImagePreview(postToEdit?.postImage || null);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="add-post-form">
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        minLength={1}
                        maxLength={500}
                        required={!postToEdit} // Require content for new posts
                    ></textarea>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="post-image"
                    />
                    <label htmlFor="post-image" className="file-input-label">
                        {image ? 'Change Image' : 'Upload Image'}
                    </label>

                    {imagePreview && (
                        <div className="image-preview-container">
                            <img
                                src={imagePreview}
                                alt="Selected preview"
                                className="image-preview"
                            />
                            <button
                                type="button"
                                className="remove-image-btn"
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(postToEdit?.postImage || null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="visibility-select"
                    >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Only Me</option>
                    </select>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading || (!postToEdit && !content.trim())}
                            className={`submit-btn ${loading ? 'loading' : ''}`}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : postToEdit ? (
                                'Update Post'
                            ) : (
                                'Create Post'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error.message || "An error occurred. Please try again."}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AddPost; 