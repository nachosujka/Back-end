import express from "express";
import { Router } from "express";
import ProductModel from "../models/product.model.js";
import { uploader } from "../dirname.js";
import methodOverride from "method-override";
import { authorization } from "../middlewares/authorization.middleware.js";
import { productDao } from "../dao/product.dao.js";
import { ProductControler } from "../controllers/product.controller.js";
import { passportCall } from "../middlewares/passport.middlewares.js";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";

const productControler = new ProductControler();
const router = Router();

router.get("/", productControler.getAll);

router.get("/:pid", productControler.getById);

router.put(
  "/:pid",
  passportCall("jwt"),
  authorization("admin"),
  productControler.update
);
router.post(
  "/",
  checkProductData,
  passportCall("jwt"),
  authorization("admin"),
  productControler.create
);

router.delete(
  "/:pid",
  passportCall("jwt"),
  authorization("admin"),
  productControler.deleteOne
);
export default router;
