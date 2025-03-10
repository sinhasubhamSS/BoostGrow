import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true  // ✅ Required participants
    }],
    lastMessage: {
        type: String,  // ✅ Removed incorrect `ref: "Chat"`
        default: ""
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);