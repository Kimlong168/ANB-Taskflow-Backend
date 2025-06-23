const mongoose = require("mongoose");

let mongoURI = process.env.MONGODB_URI;

const connect = async (callback) => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");

    callback();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = { connect };
