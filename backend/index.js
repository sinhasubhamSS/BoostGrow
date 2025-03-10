import "./config.js"
import { server } from "./src/socket.js"

import connectDB from "../backend/src/database/database.js"
// console.log(`index ${process.env.CLOUDINARY_CLOUD_NAME}`);
//Listen on the port
const PORT = process.env.PORT || 5000;
//create express app se http server bnaye 
connectDB().then(() => {

    // console.log(`index ${process.env.CLOUDINARY_CLOUD_NAME}`);
    server.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process if the database connection fails
});
