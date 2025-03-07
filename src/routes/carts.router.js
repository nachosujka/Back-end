import { Router } from "express";
import { authorization } from "../middlewares/authorization.middleware.js";
import { CartControler } from "../controllers/cart.controller.js";
import passport from "passport";
const cartControler = new CartControler();
const router = Router();

// router.use(passport.authenticate("jwt"));

router.post("/", cartControler.createCart);

router.get("/:cid", cartControler.getCartById);

router.post("/:cid/purchase", cartControler.purchaseCart);
router.post("/:cid/product/:pid", cartControler.addProductToCart);
router.delete("/:cid/products/:pid", cartControler.deleteProductToCart);

router.put("/:cid/products/:pid", cartControler.updateQuantityProductInCart);

router.delete("/:cid", cartControler.clearCart);

export default router;
