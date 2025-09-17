import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import dotenv from 'dotenv';
dotenv.config();

connectDB();

app.listen(5000, () => { 
    console.log("Server is running on port 5000");
})