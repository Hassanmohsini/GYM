import mongoose from "mongoose";
import colors from "colors";
const { MONGODB_URI } = process.env;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`:::`.green, `MONGODB connected: ${conn.connection.host}`.yellow);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
