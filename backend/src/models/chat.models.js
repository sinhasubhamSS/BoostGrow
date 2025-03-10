import mongoose, { Schema } from "mongoose";
const chatSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // receiver: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },no requirement conversationid hi bata daga kise chat ho rha hai 
    message: { type: String, required: true },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })
export const Chat = mongoose.model("Chat", chatSchema)