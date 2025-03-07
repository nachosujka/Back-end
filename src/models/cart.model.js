import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartCollection = "cart";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    default: [],
  },
});

cartSchema.pre("find", function (next) {
  this.populate("products.product");
  next();
});

const cartModel = model(cartCollection, cartSchema);

export default cartModel;
