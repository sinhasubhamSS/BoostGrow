import React, { useEffect, useInsertionEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHomeFeed } from '../../Redux/postSlice'
import PostCard from './PostCard'

function PostFeed() {
    //here we will listen the backend from where the post will come
    const dispatch = useDispatch()
    const { homeFeed, loading, error } = useSelector(state => state.post)
    useEffect(() => {
        dispatch(fetchHomeFeed())
    }, [dispatch])
    console.log(homeFeed);
    return (
        <>
            <div className="homefeed-post">
                {loading && <p>Loading posts...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && homeFeed?.map(post => (
                    <PostCard key={post._id} {...post} />

                ))}
            </div>
        </>
    )
}

export default PostFeed