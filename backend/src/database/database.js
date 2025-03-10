import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Databse connected successfully");
    } catch (error) {
        console.log("sorry their is error in db connection", error);
        process.exit(1);
    }
}
export default connectDB;