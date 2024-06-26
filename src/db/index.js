import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"


const connectDB=async ()=>{
    try {
        // await mongoose.connect('mongodb://127.0.0.1/my_database');
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error("Error: MONGODB connection FAILED ",error)
      // process is the ref of the process on which our application is currently running
      process.exit(1);
    }
}

export default connectDB;