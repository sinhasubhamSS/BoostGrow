// //for middleware and routes

// import express from "express"
// import cookieParser from "cookie-parser";
// import cors from "cors"
// const app = express()

// app.use(express.json({ limit: "10kb" }))//data from form
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
// }))
// import userRouter from "./src/rotes/userroutes.js";
// import userTask from "./src/rotes/taskroutes.js"
// app.use("/api/users", userRouter)
// app.use("/api/users/task", userTask)
// export { app }





//sever kya hai sko thoda smjhaya hai nich mein
// Customer (Client): Tumhare restaurant mein aake order place karte hain.
// Server (Server): Server waiter ki tarah kaam karta hai. Order leta hai aur kitchen ko bhejta hai.
// Kitchen (Database): Kitchen mein actual food ban raha hota hai (data), jo client ko serve kiya jata hai.
// Response (Food): Customer ko jo order diya gaya tha, woh serve kiya jata hai (data ka response).

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "10kb" })); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser()); // Parse cookies

app.use(
    cors({
        origin: 'http://localhost:5173', // Frontend URL
        credentials: true, // Allow cookies
    })
);

// Routes
import userRouter from "./src/rotes/userroutes.js";
import userTask from "./src/rotes/taskroutes.js";
import chatRoutes from "./src/rotes/chatroutes.js"
import friendRoutes from "./src/rotes/friendroutes.js"
app.use("/api/users", userRouter);
app.use("/api/users/task", userTask);
app.use("/api/users/chat", chatRoutes);
app.use("/api/users/friend", friendRoutes);

export { app };
