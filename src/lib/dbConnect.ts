import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Pehle check karein agar connection pehle se hai
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    // process.env.MONGODB_URI ka use karein
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Successfully ✅");
  } catch (error) {
    console.log("DB Connection Failed ❌", error);
    
    // Gracefully handle connection error
    process.exit(1);
  }
}

export default dbConnect;