import mongoose from "mongoose";
import cartModel from "./cart.model";

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
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
});
userSchema.post("save", async function (userCreated) {
  try {
    if (!userCreated.cart) {
      //En session controller creo carrito cuando se crea un usuario, si no se creo el carrito lo creo aca
      const newCart = await cartModel.create({ products: [] });
      userCreated.cart = newCart._id;
      const mensaje = await userCreated.save();
      console.log(mensaje);
    }
  } catch (error) {
    console.log(error);
  }
});
const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
