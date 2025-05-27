// models/like.model.js
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Unique combination to prevent duplicate likes
likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);