import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB database ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`MongoDB error : ${error}`);
  }
};

export default connectDB;
