const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/text-book-new";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Optional: exit if DB connection fails
  }
};

module.exports = connectToMongo;
