// utils/postUtils.js
export const safeArray = (arr) => Array.isArray(arr) ? arr : [];

export const updatePostInAllArrays = (state, postId, updateFn) => {
    const updater = (posts) => safeArray(posts).map(post =>
        post._id === postId ? updateFn(post) : post
    );

    state.myPost = updater(state.myPost);
    state.homeFeed = updater(state.homeFeed);
    state.otherUserPost = updater(state.otherUserPost);
};