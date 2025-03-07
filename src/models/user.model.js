import mongoose from "mongoose";
import cartModel from "./cart.model.js";

const { Schema, model } = mongoose;

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
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
});

userSchema.post("save", async function (userCreated) {
  try {
    if (!userCreated.cart) {
      const newCart = await cartModel.create({ products: [] });
      userCreated.cart = newCart._id;
      await userCreated.save();
    }
  } catch (error) {
    console.log(error);
  }
});

const userModel = model(userCollection, userSchema);

export default userModel;
