import { cartModel } from "./models/cart.model.js";

class CartDao {
  async getAll() {
    const carts = await cartModel.find();
    return carts;
  }

  async getById(id) {
    const cart = await cartModel.findById(id).populate("products.product");
    return cart;
  }

  async create() {
    const cart = await cartModel.create({});
    return cart;
  }

  async update(id, data) {
    const cartUpdate = await cartModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return cartUpdate;
  }

  async deleteOne(id) {
    const cart = await cartModel.deleteOne({ _id: id });
    return cart;
  }

  async addProductToCart(cid, pid) {
    const cart = await cartModel.findById(cid);

    const productInCart = cart.products.find(
      (element) => element.product == pid
    );
    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async deleteProductToCart(cid, pid) {
    const cart = await cartModel.findById(cid);
    cart.products = cart.products.filter((element) => element.product != pid);
    await cart.save();

    return cart;
  }

  async updateQuantityProductInCart(cid, pid, quantity) {
    const cart = await cartModel.findById(cid);
    const product = cart.products.find((element) => element.product == pid);
    product.quantity = quantity;

    await cart.save();
    return cart;
  }

  async clearProductsToCart(cid) {
    const cart = await cartModel.findById(cid);
    cart.products = [];

    await cart.save();
    return cart;
  }
}

export const cartDao = new CartDao();
