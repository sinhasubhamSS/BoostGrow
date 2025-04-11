
import { Chat } from "../models/chat.models.js";
import { User } from "../models/user.models.js";
import { Conversation } from "../models/conversation.models.js";
import { io, getReceiverSocketId } from "./../socket.js";
export const sendMessage = async (req, res) => {
    try {
        console.log("reached send message function");
        const senderId = req.user._id;
        const { receiverId, message } = req.body;
        if (!receiverId || !message) {
            return res.status(400).json({ error: "Receiver ID and message are required!" })
        }
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMessage = await Chat.create({
            conversationId: conversation._id,
            sender: { _id: senderId },
            message: message
        });
        await Conversation.findByIdAndUpdate(conversation._id, {
            $set: { lastMessage: message, lastMessageAt: new Date() },
            $push: { messages: newMessage._id }  // ✅ Conversation me message add ho jayega
        });
        // console.log("📩 New message stored:", newMessage);

        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit("receiveMessage", newMessage);
        //     console.log("✅ Message sent to receiver:", receiverSocketId);
        // } else {
        //     console.log("⚠️ Receiver is offline, message stored in DB.");
        // }

        const receiverSocketId = getReceiverSocketId(receiverId)
        // console.log(receiverSocketId);
        if (receiverSocketId) {
            console.log("sewnding from back to front");
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log("does this line execute");

        } else {
            console.log("sorry send messag hit");
        }
        res.status(201).json({ success: true, message: "Message sent!", data: newMessage });
    } catch (error) {
        console.error("❌ sendMessage Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
// 

export const getMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { otherUserId } = req.params;

        const conversation = await Conversation.findOne({ participants: { $all: [userId, otherUserId] } })
        if (!conversation) {
            return res.status(200).json({ success: true, data: [] })
        }
        //ab message nikalo

        const messages = await Chat.find({ conversationId: conversation._id })
            .populate("sender", "name")
            .sort({ createdAt: 1 });




        res.status(200).json({
            success: true, data: messages

        });

    } catch (error) {
        console.error("Error in getMessage:", error);
        res.status(500).json({ error: "Internal Server Error" });

    }
}
export const getChatUsers = async (req, res) => {
    const loggedInUserId = req.user._id;
    console.log("reached  get usere messaged controller");
    try {
        const conversations = await Conversation.find({ participants: loggedInUserId })
            .select("participants")
            .lean();

        // Extract unique user IDs (excluding the logged-in user)
        const userIds = new Set();
        conversations.forEach(({ participants }) => {
            participants.forEach(userId => {
                if (!userId.equals(loggedInUserId)) {  // ✅ Directly compare ObjectId
                    userIds.add(userId.toString());
                }
            });
        });

        // Fetch user details
        const users = await User.find({ _id: { $in: [...userIds] } })
            .select("username profilePic");
        console.log("here", users);
        return res.status(200).json({ users });

        // const chatUsers = await Conversation.aggregate([
        //     { $match: { participants: loggedInUserId } },  // Get conversations where user is a participant
        //     { $unwind: "$participants" }, // Separate participants array into multiple documents
        //     { $match: { participants: { $ne: loggedInUserId } } }, // Exclude logged-in user
        //     { $group: { _id: "$participants" } } // Get unique user IDs
        // ]);

        // const userIds = chatUsers.map(u => u._id);

        // // Fetch user details
        // const users = await User.find({ _id: { $in: userIds } })
        //     .select("username profilePic");

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error });
    }
}