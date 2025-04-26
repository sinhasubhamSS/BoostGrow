import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    fullname: {
        type: String,

        lowercase: true,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    profilePicture: {
        type: String,

    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    privacy: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'

    },
    refreshToken: {
        type: String,
    },

    //yaha sa expand kar rha hu 

    //followers system
    followers: [{
        type: Schema.Types.ObjectId, ref: "User"
    }], // Who follows this user
    following: [{
        type: Schema.Types.ObjectId, ref: "User"
    }], // Who this user follows



    friends: [{ type: Schema.Types.ObjectId, ref: "User" }], // Friends List
    friendRequests: [{
        sender: {  // ✅ ObjectId और साथ में status store करें
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }],// Pending Friend Requests
    sentFriendRequests: [{
        receiver: {   // ✅ Jisko request bheji gayi
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }]


}, {
    timestamps: true
});
userSchema.index({ friends: 1 })

export const User = mongoose.model("User", userSchema);
