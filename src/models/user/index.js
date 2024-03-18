// // models/user.js
import { hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Must be atleast 6 character"],
  },
});

// middleware for before user is saved
userSchema.pre("save", async function (next) {
  this.password = await hash(this.password, 10);
  next();
});

// must be singular , in mongodb it will be automaically plural
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
