import { cartDao } from "../dao/cart.dao.js";
import { productDao } from "../dao/product.dao.js";
import { productService } from "../services/product.services.js";
import { cartService } from "../services/cart.services.js";
import { ticketService } from "../services/ticket.services.js";
export class CartControler {
  async createCart(req, res) {
    try {
      // Busca el carrito
      const cart = await cartService.create();
      res.status(201).json({ status: "success" }, cart);
    } catch (error) {
      return res
        .status(500)
        .render("error", { Error: "Error al agregar el producto al carrito" });
    }
  }

  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);
      console.log(cart);
      if (!cart)
        return res
          .status(404)
          .json({ status: "Error", msg: "Carrito no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Error", msg: "Error al buscar un carrito" });
    }
  }
  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const product = await productService.getById(pid);
      if (!product)
        return res.status(404).json({
          status: "Error",
          msg: `No se encontró el producto con el id ${pid}`,
        });

      const cart = await cartService.addProductToCart(cid, pid);
      if (!cart)
        return res.status(404).json({
          status: "Error",
          msg: `No se encontró el carrito con el id ${cid}`,
        });

      res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Erro", msg: "Error interno del servidor" });
    }
  }
  async deleteProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const product = await productService.getById(pid);
      // Encuentra el carrito por su ID
      if (!product)
        return res.status(404).json({ message: "Carrito no encontrado" });

      // Filtra los productos para eliminar el producto especifico
      const cart = await cartService.getById(cid);
      if (!cart)
        return res.status(404).json({ message: "Carrito no encontrado" });
      const cartUpdate = await cartService.deleteProductToCart(cid, pid);
      res.status(200).json({ status: "success", payload: cartUpdate });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el producto del carrito" });
    }
  }

  async updateQuantityProductInCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const product = await productService.getById(pid);
      if (!product)
        return res.status(404).json({
          status: "Error",
          msg: `No se encontró el producto con el id ${pid}`,
        });
      const cart = await cartService.getById(cid);
      if (!cart)
        return res.status(404).json({
          status: "Error",
          msg: `No se encontró el carrito con el id ${cid}`,
        });

      const cartUpdate = await cartService.updateQuantityProductInCart(
        cid,
        pid,
        Number(quantity)
      );

      res.status(200).json({ status: "success", payload: cartUpdate });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "Error",
        msg: "Error al cambiar el carrito o producto",
      });
    }
  }
  async clearCart(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartService.clearProductsToCart(cid);
      if (!cart)
        return res
          .status(404)
          .json({ status: "Error", msg: "Carrito no encontrado" });

      res.status(200).json({ status: "success", cart });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Error", msg: "Error al eliminar el carrito" });
    }
  }
  async purchaseCart(req, res) {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);
      if (!cart)
        return res
          .status(404)
          .json({ status: "Error", msg: "Carrito no encontrado" });
      const total = await cartService.purchaseCart(cid);

      if (total === 0)
        return res.status(400).json({
          status: "Error",
          msg: "No hay stock suficiente para comprar los productos",
        });
      const ticket = await ticketService.create(total, req.user.email);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Error", msg: "Error al eliminar el carrito" });
    }
  }
}
