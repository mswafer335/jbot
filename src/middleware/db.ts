import * as dotenv from "dotenv";

import mongoose from "mongoose";
dotenv.config();
const db = process.env.DATABASE_URL;

export async function connectDB() {
    try {
        await mongoose.connect(db!, {
            //@ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //   useCreateIndex: true,
            //   useFindAndModify: false,
        });
        console.log("MongoDB connected");
    } catch (error) {
        //@ts-ignore
        console.error(error.message);
        process.exit(1);
    }
}
