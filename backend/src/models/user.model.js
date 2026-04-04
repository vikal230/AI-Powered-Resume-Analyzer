import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: [true, "username already exists"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "account already exists with this email"],
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("users", userSchema)
export default userModel;