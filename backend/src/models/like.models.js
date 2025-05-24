import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate likes by same user on same post
likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema)
