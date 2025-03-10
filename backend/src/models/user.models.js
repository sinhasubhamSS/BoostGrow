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
        unique: true,
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
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    friendRequests: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);
