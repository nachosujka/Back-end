import ticketModel from "../models/ticket.model.js";
class TicketDao {
  async getAll(query, options) {
    const products = await productModel.paginate(query, options);
    return products;
  }

  async create(data) {
    const product = await productModel.create(data);
    return product;
  }

  async getById(id) {
    const product = await productModel.findById(id);
    return product;
  }

  async update(id, data) {
    const productUpdate = await productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return productUpdate;
  }

  async deleteOne(id) {
    const product = await productModel.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );
    return product;
  }
}

export const ticketDao = new TicketDao();
