import { Router } from "express";
import cartsRouter from "./carts.router.js";
import sessionRouter from "./session.router.js";
import productsRouter from "./products.router.js";
import mocksRouter from "./mocks.router.js";
const router = Router();

router.use("/carts", cartsRouter);
router.use("/session", sessionRouter);
router.use("/products", productsRouter);
router.use("/mocks", mocksRouter);
export default router;
