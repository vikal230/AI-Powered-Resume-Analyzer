import mongoose from "mongoose";

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("mongo db connected successfully")
    // console.log(process.env.MONGODB_URI)
  } catch (error) {
    console.log("mongo db connection me error aa gya hai!", error)
  }
}

export default connectDb;