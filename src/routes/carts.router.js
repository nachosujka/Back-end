import { Router } from "express";
import { authorization } from "../middlewares/authorization.middleware.js";
import { CartControler } from "../controllers/cart.controller.js";
import passport from "passport";
const cartControler = new CartControler();
const router = Router();

router.use(passport.authenticate("jwt"));

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
