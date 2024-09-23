import express from "express";
import { products } from "./products.router.js";
const router = express.Router();
router.get("/", (req, res) => {
  res.render("realTimeProducts", { products });
});
export default router;
