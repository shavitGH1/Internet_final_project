import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: { 
    type: String, required: true, unique: true
   },
  profilePic: { 
    type: String, 
    default: "/avatar.png" 
  },
  refreshToken: {
    type: [String],
  },
});

export default mongoose.model("User", userSchema);