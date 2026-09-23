const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    "mongodb+srv://friendstack01:friendstack01@friendstack.re1rimr.mongodb.net/wmt_db?retryWrites=true&w=majority&appName=friendstack";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log("Check MONGO_URI in server/.env. The Atlas connection currently failed.");
  }
};

module.exports = connectDB;
