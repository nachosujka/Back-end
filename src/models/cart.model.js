import mongoose from "mongoose";
import productModel from "./product.model.js";

const { Schema } = mongoose;

const cartColection = "cart";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, require: true, default: 1 },
      },
    ],
    default: [],
  },
});
cartSchema.pre("find", function (next) {
  this.populate("products.product");
  next();
});
const cartModel = mongoose.model(cartColection, cartSchema);

export default cartModel;
