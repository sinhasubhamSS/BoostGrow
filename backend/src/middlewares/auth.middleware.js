import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const authverify = async (req, res, next) => {
    try {
        // console.log("Middleware reached");
        // console.log("Cookies:", req.cookies);
        // console.log("Authorization Header:", req.header("Authorization"));

        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Extracted token:", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized request: No token provided" });
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded token:", decodedToken);

            const user = await User.findById(decodedToken._id);
            if (!user) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }

            req.user = user; // Store user data in request object
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Access token expired" });
            }
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    } catch (error) {
        // console.error("Error in auth middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//basically ye authorization ma kya hota hai ki jo user request
// bhej rha hai uska data header sa ya cookie sa token ma sa nikal ka
// token id se uss user ka information nikala jata hai aur usko req.user=user
//ma store kar diya jata hai taki usko next middleware use kar sake