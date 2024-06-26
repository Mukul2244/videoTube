import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

// require("dotenv").config({path:"./.env"})
dotenv.config({
    path: "./.env"
})





connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`App is running at port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed..!!!",err);
})






























/*
approach 1 to connect with the DB------------------------------------------------------------->


;(async ()=>{
    try {
        // await mongoose.connect('mongodb://127.0.0.1/my_database');
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.error("Error:express app can't able to talk with the DB ",error)
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listening at the port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("Error:some problem in establishing the connection with the DB ",error)
        throw error
    }
})()
*/