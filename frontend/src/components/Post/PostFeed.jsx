import React, { useEffect, useInsertionEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHomeFeed } from '../../Redux/postSlice'
import PostCard from './PostCard'
import "./postfeed.css"
function PostFeed() {
    //here we will listen the backend from where the post will come
    const dispatch = useDispatch()
    const { homeFeed, loading, error } = useSelector(state => state.post)


    useEffect(() => {
        dispatch(fetchHomeFeed())
    }, [dispatch])
    console.log(homeFeed);
    return (
        <div className="homefeed-post">
            {homeFeed.length > 0 ? (
                homeFeed.map((post) => (
                    <PostCard key={post._id} {...post} />
                ))
            ) : loading ? (
                <p>Loading posts...</p>  // Only when posts.length === 0
            ) : (
                <p>No posts yet.</p>
            )}

        </div>

    )
}

export default PostFeed