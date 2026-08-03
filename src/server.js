import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import express from "express";
import app from "./app.js";










const StartServer = async ()=>{


try{
     await connectDB();
     app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
}
catch(error){
    console.error(" Server Failed To Start");
        console.error(error.message);

        process.exit(1); 
}

}

StartServer();