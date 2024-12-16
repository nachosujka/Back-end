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
import { passportCall } from "../middlewares/passport.middlewares.js";
import { CartControler } from "../controlers/cart.controler.js";

const cartControler = new CartControler();
const router = Router();

router.use(passportCall("jwt"));

router.post("/", authorization("admin"), cartControler.createCart);

router.get("/:cid", authorization("user"), cartControler.getCartById);

router.post(
  "/:cid/purchase",
  authorization("user"),
  cartControler.purchaseCart
);
router.post(
  "/:cid/product/:pid",
  authorization("user"),
  cartControler.addProductToCart
);
router.delete(
  "/:cid/products/:pid",
  authorization("user"),
  cartControler.deleteProductToCart
);

router.put(
  "/:cid/products/:pid",
  authorization("user"),
  cartControler.updateQuantityProductInCart
);

router.delete("/:cid", authorization("admin"), cartControler.clearCart);

export default router;
