import mongoose from 'mongoose';    

async function connectDB(){
   try{
     await mongoose.connect(process.env.MONGO_URI)
   }catch(err){
     console.log("Error in DB connection", err);
   }
}

export default connectDB;