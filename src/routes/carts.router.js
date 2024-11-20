import { error } from "console";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { cartDao } from "../dao/cart.dao.js";
import { productDao } from "../dao/product.dao.js";
import { authorization } from "../middlewares/authorization.middleware.js";
const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "carts.json");

router.use(passportCall("jwt"));

router.post("/", authorization("admin"), async (req, res) => {
  try {
    // Busca el carrito
    const cart = await cartDao.create();
    res.status(201).json({ status: "success" }, cart);
  } catch (error) {
    return res
      .status(500)
      .render("error", { Error: "Error al agregar el producto al carrito" });
  }
});

router.get("/:cid", authorization("user"), async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getById(cid);
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
});

router.delete(
  "/:cid/products/:pid",
  authorization("user"),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      // Encuentra el carrito por su ID
      const product = await productDao.getById(pid);
      if (!product)
        return res.status(404).json({ message: "Carrito no encontrado" });

      // Filtra los productos para eliminar el producto especifico
      const cart = await cartDao.getById(cid);
      if (!cart)
        return res.status(404).json({ message: "Carrito no encontrado" });
      await cart.save();

      res.status(200).json({ status: "success", payload: cartUpdate });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el producto del carrito" });
    }
  }
);

router.put("/:cid/products/:pid", authorization("user"), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const product = await productDao.getById(pid);
    if (!product)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el producto con el id ${pid}`,
      });
    const cart = await cartDao.getById(cid);
    if (!cart)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cid}`,
      });

    const cartUpdate = await cartDao.updateQuantityProductInCart(
      cid,
      pid,
      Number(quantity)
    );

    res.status(200).json({ status: "success", payload: cartUpdate });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error al cambiar el carrito o producto" });
  }
});

router.delete("/:cid", authorization("admin"), async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.clearProductsToCart(cid);
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
});

export default router;
