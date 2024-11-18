import mongoose from "mongoose";

const { Schema } = mongoose;

const userCollection = "users";

const userSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, unique: true },
  age: { type: Number },
  password: { type: String },
  role: {
    type: String,
    default: "user",
  },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
