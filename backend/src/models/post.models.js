import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({

    content: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    visibility: {
        type: String,
        enum: ["public", "private", "friends"],
        default: "public"
    },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
}, { timestamps: true })
export const Post = mongoose.model("Post", postSchema)