import mongoose from "mongoose";

const { Schema } = mongoose;

const ticketColection = "ticket";

const ticketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datatime: { type: Date, default: Date.now() },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

const ticketModel = mongoose.model(ticketColection, ticketSchema);

export default ticketModel;
