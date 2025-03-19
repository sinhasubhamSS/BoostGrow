//lets write the controller 
//register is the first controller
/**
first of all user will register itself
we need input from user and we can take using req.body and as user  will send it therefore this will be the post method
if need to take data from url use req.params
so first of all we will create variable named register
this will be the db calls which is async functioin
so we will take input from user after that check if that email  already exist  username  exist or not 
then register the user 
//take all input from user
//check if required fields are empty
check if email alreay resgistered
check if username is unique or not

 */
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../specific/cloudinary.js";
import bcrypt from "bcrypt"
import { io } from "../socket.js"
const register = async (req, res) => {
    try {
        const { fullname, email, username, password, adminkey } = req.body;
        //validating user
        //way 1
        // if(
        //     [fullname,email,username,password].some((field)=>field?.trim()==="")

        // )
        // {
        //     return res.status(400).json({ message: "All fields are required." });
        // }
        //easy way way2
        if (
            (!username || !email || !password || !fullname)) {
            return res.status(400).json({ message: "All fields are required." });

        }
        //check if email already registered
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Username already registered" })
        }
        const isadmin = adminkey === process.env.Adminkey

        const hashedPassword = await bcrypt.hash(password, 10)
        //now take image as input form
        //using multer for uploading image and cloudinary for storing the image
        //so multer is middleware lest goto middleware folder and create middleware
        // const profilepath = req.files?.profilePicture?.[0]?.path;
        // console.log(profilepath);
        // if (!profilepath) {
        //     return res.status(400).json({ message: "Profile Picture is required" })

        // }
        // const profilePicture = await uploadOnCloudinary(profilepath)
        // if (!profilePicture || !profilePicture.url) {
        //     return res.status(400).json({ message: "Profile Picture is failed to upload" })
        // }

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            // profilePicture: profilePicture.url,
            username: username.toLowerCase(),
            role: isadmin ? "admin" : "user"
        });
        const createduser = await User.findById(user._id).select("-password")
        if (!createduser) {
            return res.status(400).json({
                message: "registering user not created"
            })
        }
        console.log("reached emit at register");
        io.emit("newUserRegistered", createduser);
        console.log("sent emit from register")
        return res.status(200).json({
            user: createduser, message: "User created successfully",
            role: user.role
        });
    }


    catch (error) {
        console.log(`error at reistering the user ${error}`);

        return res.status(500).json({ message: "Server error occurred during registration." });
    }


}
const login = async (req, res) => {
    try {
        // console.log("reached here login");
        const { username, email, password } = req.body;
        // console.log("Request Body:", req.body);
        if (!username && !email) {
            return res.status(400).json({
                message: "username or email is required"
            })
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]

        });
        if (!user) {
            return res.status(400).json({
                message: "user is not registered"
            })
        }
        //check password is valid or invalid
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(400).json({
                message: "Password is not valid"
            })
        }
        const tokendata = {
            _id: user._id,
        }
        const acesstoken = jwt.sign(tokendata,
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )
        const refreshToken = jwt.sign(
            tokendata,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '7d'
            }
        );
        //now save the accesstoken to refreshtoken database
        user.refreshToken = refreshToken;
        await user.save();
        // console.log("done");
        //now send token as response
        // Jab tum cookies set kar rahe ho, to security parameters include karna zaruri hai, jaise:


        res.status(200)
            .cookie("accesstoken", acesstoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry (IMPORTANT)
            })
            .cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry (IMPORTANT)
            })
            .json({
                success: true,
                message: "successful login",
                refreshToken,
                acesstoken,
                user,
            });


    } catch (error) {
        console.log("error inside login");
        console.log(error);

    }
}
const logout = async (req, res) => {
    try {

        //we have to find the userid and update it lets check mongodb function
        await User.findByIdAndUpdate(
            req.user._id, {
            $unset: {
                refreshToken: 1
            }

        },
            { new: true }
        );
        const options = {
            httpOnly: true,
            secure: true
        }
        //clear the cooies 

        return res.status(200)
            .clearCookie("accesstoken", options)
            .clearCookie("refreshtoken", options)
            .json({
                message: "user logged out successfully"
            })


    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({ message: "Server error." });

    }

}
//now use refresh token to generate access token okay
const reaccesstoken = async (req, res) => {
    try {
        const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken;
        console.log(incomingrefreshtoken);

        if (!incomingrefreshtoken) {
            return res.status(403).json({ message: "Unauthorized: No refresh token" });
        }

        // Verifying the incoming refresh token
        let decodedToken;
        try {
            decodedToken = jwt.verify(incomingrefreshtoken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Token not valid or expired" });
        }

        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Compare the incoming refresh token with the stored refresh token in the database
        if (incomingrefreshtoken !== user.refreshToken) {
            return res.status(401).json({ message: "Refresh token is expired or used" });
        }

        // Generate new access token and refresh token
        const newaccestoken = jwt.sign(
            { _id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const newRefreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Update the user's refresh token
        user.refreshToken = newRefreshToken;
        try {
            await user.save();
        } catch (saveError) {
            console.error("Error saving new refresh token:", saveError);
            return res.status(500).json({ message: "Internal server error while saving refresh token" });
        }

        // Set new cookies and send response
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry (IMPORTANT)
        };

        res.status(200)
            .cookie("accesstoken", newaccestoken, options)
            .cookie("refreshtoken", newRefreshToken, options)
            .json({
                message: "Successfully refreshed tokens",
                newaccestoken,
                newRefreshToken,
            });
    } catch (error) {
        console.error("Error in refreshing access token:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const promoteUser = async (req, res) => {
    try {
        const { userId } = req.body;//the id of people who is to be promoted
        if (!userId) {
            return res.status(401).json({ message: "user id is required" })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "user not found" })
        }
        if (user.role === "admin") {
            return res.status(400).json({ message: "user is already an admin" })
        }
        user.role = "admin";
        await user.save();
        return res.status(200).json({ message: "User promoted to admin successfully." })
    } catch (error) {
        console.log("error at promoting the user");
        console.error("Error promoting user to admin:", error);
        return res.status(500).json({ message: "Failed to promote user to admin." });

    }
}
//next what to do lets think
//so next controller to update password/change and update profle get user profile delete user profile
//to pahla get user profile laik late hai 
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.status(401).json({ message: "unauthorize id" })
        }
        const user = await User.findById(userId).select("-password -refreshToken")
        if (!user) {
            return res.status(401).json({ message: "user not found" })
        }
        return res.status(200).json({ user })
    } catch (error) {
        console.log(error);
        console.log("occured at extracting the user d4ata ");

    }


}
const getAllUser = async (req, res) => {
    try {

        const userId = req.user?._id;
        //fetch all users excluding the logged in user
        const users = await User.find({ _id: { $ne: userId } });
        if (!users) {
            return res.status(401).json({ message: "no users" })
        }
        // console.log("completed");
        // console.log(users);
        res.status(200).json({ success: "true", users })
    } catch (error) {

        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const changePassword = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.status(401).json({ message: "Unauthorize user" })
        }

        const { oldpassword, newpassword } = req.body
        if (!oldpassword || !newpassword) {
            return res.status(400).json({ message: "Both old and new passwords are required" });
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //now check if oldpassword matches with previous one or not
        const isMatch = await bcrypt.compare(oldpassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        //now hash the new password
        const hashedPassword = await bcrypt.hash(newpassword, 10)
        //now update the password data
        user.password = hashedPassword;
        //now save the updated data in database
        user.save();
        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
}
//now feature for update user account
const updateuserprofile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "user not authorized" })

        }
        const { username, email, fullname, privacy } = req.body;
        const updateData = {}
        if (username) {
            updateData.username = username.toLowerCase();
        }
        if (email) updateData.email = email;
        if (fullname) updateData.fullname = fullname;
        if (privacy) {
            const allowedPrivacy = ["public", "private"];
            if (!allowedPrivacy.includes(privacy.toLowerCase())) {
                return res.status(400).json({ message: "Invalid privacy setting. Allowed values: public, private." });
            }
            updateData.privacy = privacy.toLowerCase();
        }
        // const updateData = { ...req.body }; 
        if (req.file) {
            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            //Delete the old profile picture
            if (user.profilePicture) {
                const detetionresult = await deleteFromCloudinary(user.profilePicture)
                if (!detetionresult) {
                    return res.status(401).json({ message: "Failed to delete the profilepicture" })
                }
            }

            const profilepicture = await uploadOnCloudinary(req.file.path);
            if (!profilepicture || !profilepicture.url) {
                return res.status(400).json({ message: "Profile picture upload failed" });
            }

            updateData.profilePicture = profilepicture.url
        }



        //check if updated data is empty or 
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data provided to update." });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password")

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error: Could not update profile." });
    }
};
// dekho ab user ko delete karna ka 2 option hoota hai ek permanent delete aur ek soft delete soft delete ma data db ma store hota hai aur baad ma kabhi kaam ah sakta hai lakin permanent ma fully delete ho jata hai
//hum log abhi soft delete pa dekhta hai
const softdelete = async (req, res) => {

    try {
        const { userId } = req.params;
        const authenticateduserId = req.user?._id;
        const authenticateduserrole = req.user?.role;

        //ab ye v to dekhana hoga delete kon kar rha hai user ya admin
        let targetID = userId || authenticateduserId;
        if (!targetID) {
            return res.status(403).json({ message: "User id is required for deletion" });
        }
        //ab role pa charcha karta hai agar agar ek user dusre ko tabhi delete kar sakta hai jab wo user ho
        if (userId && authenticateduserrole !== "admin") {
            return res.status(403).json({
                message: "Only admin can delete the user"
            })
        }
        const user = await User.findById(targetID)
        if (!targetID) {
            return res.status(400).json({ message: "user not found" })
        }
        //agar pahla sa soft deleted hai tab 
        if (user.isDeleted) {
            return res.status(400).json({ message: "User is already soft deleted." });
        }
        //agar pahla sa soft delete nhi hai to soft delete kar do
        user.isDeleted = true;
        user.deletedAt = new Date();
        await user.save();
        return res.status({
            message: `User with ID ${targetID} has been soft deleted`
        })
    } catch (error) {
        console.error("Error soft deleting profile:", error);
        res.status(500).json({ message: "Server error: Could not delete profile." });
    }
}

export { register, login, logout, reaccesstoken, getCurrentUser, getAllUser, changePassword, updateuserprofile, promoteUser, softdelete }




