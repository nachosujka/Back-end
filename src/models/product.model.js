import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const productCollection = "Product";

const productSchema = new Schema(
  {
    nombre: { type: String, required: true, minlength: 3 },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    stock: { type: Number, required: true },
    categoria: { type: String, required: true },
    thumbnail: { type: String },
  },
  { timestamps: true }
);
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
