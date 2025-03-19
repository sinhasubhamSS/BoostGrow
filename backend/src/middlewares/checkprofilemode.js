import { User } from "../models/user.models.js";

export const checkprofilemode = async (req, res, next) => {
    try {
        const senderId = req.user._id;
        const { receiverId } = req.body;
        if (!receiverId) {
            return res.status(400).json({ message: "no receiver id present" })
        }
        //agar receiver id hai tp receiver ka data etch karte hai thik hai 
        const receiverUser = await User.findById(receiverId).select("privacy friends ");
        if (!receiverUser) {
            return res.status(400).json({ message: "failed to fetch the user" })
        }


        //ab check karo ki receiver user ka profile puclic hai ya private
        if (receiverUser.privacy === 'public') {
            return next();

        }
        //ab agar profile private hai tab ka scene dekhta hai ok
        // const friendList = receiverUser?.friends.map(friendId => friendId.toString());

        const friendList = Array.isArray(receiverUser.friends)
            ? receiverUser.friends.map(friendId => friendId.toString())
            : [];



        if (friendList.includes(senderId.toString())) {
            return next();
        }
        //here use some instead of include and map
        // ab agar  friend v nhi hai aur public v account nhi hai to isko hata datahai 
        return res.status(403).json({ message: "This profile is private " })
    } catch (error) {
        console.error("Error in checkMessagingPermission:", error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}