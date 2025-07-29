import mongoose from "mongoose";
import { config } from "./config";

export async function connectDb() {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(config.MONGO_URI, { dbName: "test" });
    console.log("✅ MongoDB connected");
}
