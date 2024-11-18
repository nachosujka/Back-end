import { error } from "console";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "carts.json");

router.post("/", async (req, res) => {
  console.log("Usando post");
  const { productId } = req.body;
  const cartId = "671550832994b7c6cd57b94a";
  try {
    // Busca el carrito
    let cart = await cartModel.findById(cartId);

    if (!cart) {
      // Si no existe el carrito, crea uno nuevo
      cart = new cartModel({ _id: cartId, products: [] });
    }

    // Buscar el producto que se quiere agregar al carrito
    const product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .render("error", { Error: "Producto no encontrado" });
    }

    // Verifica si el producto ya esta en el carrito
    const existingProduct = cart.products.find(
      (p) =>
        p.product && productId && p.product.toString() === productId.toString()
    );
    if (existingProduct) {
      // Si ya está en el carrito, aumenta la cantidad
      existingProduct.quantity += 1;
    } else {
      // Si no esta en el carrito, lo agrega con cantidad 1
      cart.products.push({ productId, quantity: 1 });
    }

    await cart.save();

    res.redirect("products");
  } catch (error) {
    return res
      .status(500)
      .render("error", { Error: "Error al agregar el producto al carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartModel.findById(cartId).populate("products.product");
    console.log(cart);
    if (!cart) {
      return res.render("error", {
        error: "Error al obtener productos",
      });
    }
    if (cart.products.length === 0) {
      console.log("El carrito no tiene productos.");
    }
    res.render("carts", { cart: cart.toObject() });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const idCar = req.params.cid;
  const productId = req.params.pid;
  try {
    // Encuentra el carrito por su ID
    const cart = await cartModel.findById(idCar);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Filtra los productos para eliminar el producto especifico
    cart.products = cart.products.filter(
      (product) => product._id.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al eliminar el producto del carrito" });
  }
});

router.put("/:cid", async (req, res) => {
  const idCarrito = req.params.cid;
  const nuevosProductos = req.body.products;
  try {
    const carrito = await cartModel.findById(idCarrito);
    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    carrito.products = nuevosProductos;
    await carrito.save();
    res.json({ message: "Carrito actualizado con éxito", carrito });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const idCarrito = req.params.cid;
  const idProducto = req.params.pid;
  const nuevaCantidad = req.body.stock;
  try {
    if (
      !nuevaCantidad ||
      typeof nuevaCantidad !== "number" ||
      nuevaCantidad < 1
    ) {
      return res
        .status(400)
        .json({ error: "Cantidad inválida. Debe ser un número mayor que 0." });
    }
    const carrito = await cartModel.findById(idCarrito);
    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const producto = carrito.products.find(
      (prod) => prod._id.toString() === idProducto
    );
    if (!producto) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }
    producto.stock = nuevaCantidad;
    await carrito.save();
    res.json({
      message: "Cantidad del producto actualizada con éxito",
      carrito,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const idCarrito = req.params.cid;
  try {
    const carrito = cartModel.findById(idCarrito);
    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    carrito.products = [];

    await carrito.save();
    res.json({
      message: "Todos los productos han sido eliminados del carrito",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al eliminar los productos del carrito" });
  }
});

export default router;
