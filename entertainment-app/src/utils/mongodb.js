import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if(!MONGO_URI){
    throw new Error("Please define MONGO_URI environment");
}

async function dbConnect(){
    if(mongoose.connection.readyState !== 1){
        try {
            await mongoose.connect(MONGO_URI);
            console.log("Db is connected!");
        } catch (error) {
            console.error("Db is not connected!")
        }
    }else{
        console.log("Db is already connected!");
    }
}

export default dbConnect;