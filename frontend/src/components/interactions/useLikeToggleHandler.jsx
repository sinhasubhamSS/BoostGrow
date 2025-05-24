// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { toggleLike } from '../../Redux/interactionSlice';

// export default function useLikeToggleHandler() {
//     const dispatch = useDispatch();
//     const likeStatus = useSelector((state) => state.interaction.likeStatus);
//     console.log("this is like status",likeStatus);

//     // dispatch needs the postId argument
//     const handleToggleLike = (postId) => {
//         dispatch(toggleLike(postId));
//     };

//     const isPostLiked = (postId) => {
//         return likeStatus[postId]?.liked ?? false;
//     };

//     const getLikeCount = (postId) => {
//         return likeStatus[postId]?.likeCount ?? 0;
//     };
//     return { handleToggleLike, isPostLiked, getLikeCount }
// }

