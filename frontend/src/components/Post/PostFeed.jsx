import React, { useEffect, useInsertionEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHomeFeed } from '../../Redux/postSlice'
import PostCard from './PostCard'
import "./postfeed.css"
function PostFeed() {
    //here we will listen the backend from where the post will come
    const dispatch = useDispatch()
    const { homeFeed, loading, error } = useSelector(state => state.post)
    console.log(homeFeed.map(p => p._id)); // Ensure all have valid and unique _id

    useEffect(() => {
        dispatch(fetchHomeFeed())
    }, [dispatch])
    console.log(homeFeed);
    return (

        <div className="homefeed-post">
            {loading && <div className="loading-spinner"></div>}
            {error && <div className="error-message">{typeof error === "string" ? error : error.message}</div>}
            {!loading && homeFeed?.map((post, index) => (
                <div key={post._id}>
                    <PostCard {...post} />
                    {index !== homeFeed.length - 1 && (
                        <div className="post-divider"></div>
                    )}
                </div>
            ))}
        </div>

    )
}

export default PostFeed