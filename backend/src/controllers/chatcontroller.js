
import { Chat } from "../models/chat.models.js";
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
        console.log("📩 New message stored:", newMessage);

        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit("receiveMessage", newMessage);
        //     console.log("✅ Message sent to receiver:", receiverSocketId);
        // } else {
        //     console.log("⚠️ Receiver is offline, message stored in DB.");
        // }

         const receiverSocketId = getReceiverSocketId(receiverId)
         console.log(receiverSocketId);
                if (receiverSocketId) {
                    console.log("sewnding from back to front");
                    io.to(receiverSocketId).emit("newMessage", newMessage);
                    console.log("does this line execute");

                }else{
                    console.log("sorry send messag hit");
                }
        res.status(201).json({ success: true, message: "Message sent!", data: newMessage });
    } catch (error) {
        console.error("❌ sendMessage Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
// export const sendMessage = async (req, res) => {
//     try {
//         console.log("reached send message");
//         const senderId = req.user._id
//         const { receiverId, message } = req.body;
//         if (!receiverId || !message) {
//             return res.status(400).json({ error: "Receiver ID and message are required!" })
//         }
//         //check karo ki pahla sa koi conversation exist karta hai ki 
//         // nhi agar ha to usma continue karo ya phir new create karo 
//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         })
//         if (!conversation) {
//             //nahi hai pahla sa ab creata karte hai
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId]
//             })
//         }

//         //ab message ko save karo

//         const newMessage = await Chat.create({
//             conversationId: conversation._id,
//             sender: { _id: senderId },
//             message: message
//         });
//         await Conversation.findByIdAndUpdate(conversation._id, {
//             lastMessage: message,
//             lastMessageAt: new Date()
//         })
//         // ye wala code dono ek dusre sa independent hai aur do bar await ho rha hai uska matlab uneccessary do bar rukna hoga usse acha promise.all ka use kar lata hu
//         // const [newMessage] = await Promise.all([
//         //     Chat.create({
//         //         conversationId: conversation._id,
//         //         sender: senderId,
//         //         message

//         //     }),
//         //     Conversation.findByIdAndUpdate(conversation._id, {
//         //         $set: { lastMessage: message, lastMessageAt: new Date() }
//         //     })
//         // ]);

//         console.log("naya consolepahuch gaya ");

//         // const senderSocketId = users.get(senderId);
//         // console.log("send ka andar hu",senderSocketId);
//         // if (senderSocketId) {
//         //     // सही format में data emit करें
//         //     io.to(receiverSocketId).emit('receiveMessage', {
//         //         _id: newMessage._id, // ✅ Message ID जोड़ें
//         //         conversationId: conversation._id,
//         //         sender: { _id: senderId }, // sender को object में
//         //         message: newMessage.message,
//         //         createdAt: newMessage.createdAt // ✅ Timestamp
//         //     });

//         // }
//         // else{
//         //     console.log("sorry sendersocket id ka andar nhi gaya ");
//         // }
//         const receiverSocketId = getReceiverSocketId(receiverId)// ✅ newMessage.receiverId use karo
//         console.log("📩 Message received in backend:", receiverSocketId);

//         if (receiverSocketId) {
//             console.log("Receiver found with Socket ID:", receiverSocketId);
//             // ✅ Emit correctly formatted message
//             io.to(receiverSocketId).emit('receiveMessage',newMessage);

//             console.log("Message sent to Receiver:", receiverSocketId);
//         } else {
//             console.log("Receiver not connected:", newMessage.receiverId);
//         }

//         res.status(201).json({ success: true, message: "Message sent!", data: newMessage });
//     } catch (error) {
//         console.error("Error in getMessage:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }

// }


//nicha mai conversation id sa direct message karunga mujhe receiverId body me send nhi karna hoga

// export const sendMessage = async (req, res) => {
//     try {
//         const senderId = req.user._id
//         console.log(senderId);
//         const { conversationId, message } = req.body;
//         console.log(conversationId);
//         console.log(message);


//         if (!conversationId || !message) {
//             return res.status(400).json({ error: "conversation ID and message are required!" })
//         }
//         //check karo ki pahla sa koi conversation exist karta hai ki 
//         // nhi agar ha to usma continue karo ya phir new create karo 
//         const  conversation = await Conversation.findById(conversationId);

//         console.log("Found Conversation:", conversation);
//         if (!conversation) {
//             //nahi hai pahla sa ab creata karte hai
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId]
//             })
//             console.log("New Conversation Created:", conversation);
//         }

//         //ab message ko save karo

//         const newMessage = await Chat.create({
//             conversationId: conversation._id,
//             sender: senderId,
//             message: message
//         });
//         await Conversation.findByIdAndUpdate(conversation._id, {
//             lastMessage: message,
//             lastMessageAt: new Date()
//         })
//         // ye wala code dono ek dusre sa independent hai aur do bar await ho rha hai uska matlab uneccessary do bar rukna hoga usse acha promise.all ka use kar lata hu
//         // const [newMessage] = await Promise.all([
//         //     Chat.create({
//         //         conversationId: conversation._id,
//         //         sender: senderId,
//         //         message

//         //     }),
//         //     Conversation.findByIdAndUpdate(conversation._id, {
//         //         $set: { lastMessage: message, lastMessageAt: new Date() }
//         //     })
//         // ]);
//         console.log("Message Sent:", newMessage);
//         res.status(201).json({ success: true, message: "Message sent!", data: newMessage });
//     } catch (error) {
//         console.error("Error in getMessage:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }

// }

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