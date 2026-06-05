const mongoose = require("mongoose");

const connectDB = async () => {
try {
  await mongoose.connect(process.env.MONGO_URI)
  console.log("MongoDB connected")
  console.log("URI:", JSON.stringify(process.env.MONGO_URI));

} catch (error) {
  console.error("Database connection failed")
  console.log("URI:", JSON.stringify(process.env.MONGO_URI));
  console.error(error)
}
};

module.exports = connectDB;
