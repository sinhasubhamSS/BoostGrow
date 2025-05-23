import React, { useState } from 'react'
import { addPost } from '../../Redux/postSlice'
import { useDispatch, useSelector, } from 'react-redux'
import "./addpost.css"
function AddPost({ onClose }) {

    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [visibility, setVisibility] = useState("public")
    const [imagePreview, setImagePreview] = useState(null)
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.post);


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        formData.append('visibility', visibility);
        if (image) {
            formData.append('postImage', image);
        }

        dispatch(addPost(formData))
            .unwrap()
            .then(() => {
                // Close modal only on successful post
                handleClose();
            })
            .catch((error) => {
                console.error("Post creation failed:", error);
                // Error will be shown automatically through Redux state
            });
    };

    const handleClose = () => {
        setContent('');
        setImage(null);
        setImagePreview(null);
        setVisibility('public');
        onClose(); // This calls the setShowPostModal(false) from Navbar
    };
const handleImageChange=(e)=>{
    const file=e.target.files[0];
    setImage(file);
    if(file)
    {
        const reader=new FileReader();
        reader.onloadend=()=>{
            setImagePreview(reader.result);

        }
        reader.readAsDataURL(file);
    }else{
        setImagePreview(null)
    }
}

    return (
        <><div className="modal-overlay">
            <div className="add-post-form">

                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="whay is on your mind"
                        value={content}
                        onChange={(e => setContent(e.target.value))}

                    ></textarea>
                    <input type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview &&(
                        <img
                            src={imagePreview}
                            alt='Selected'
                            className='image-preview'
                        />
                    )}
                    <select value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}>
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Only Me</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                    <button onClick={handleClose} className="cls-btn">X</button>
                    {error && (
                        <p className="text-red-500 text-sm mt-1">
                            {error.message || error}
                        </p>
                    )}
                </form>
            </div>
        </div>
        </>


    )
}

export default AddPost