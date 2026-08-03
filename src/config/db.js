import mongoose from 'mongoose';
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Google & Cloudflare DNS

const connectDB = async()=>{

 try{  const conn = await mongoose.connect(process.env.MONGO_URI);
   console.log(`MongoDB Connected: ${conn.connection.host}`);
}
catch(error){
    console.log('ERROR:', error.message);
process.exit(1);
}
}

export default connectDB;