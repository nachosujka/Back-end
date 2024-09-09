import { error } from "console";
import { Router } from "express";
import { uploader } from "../utils.js";
import { pid } from "process";
import { v4 as uuidv4 } from "uuid";
const router = Router();

let products = [];

router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date()}`);
  next();
});

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const productsWithLimit =
    products.length <= limit ? products : products.slice(0, limit);
  res.json(productsWithLimit);
});

router.get("/:pid", (req, res) => {
  const idProduct = req.params.pid;

  let product = products.find((u) => u.pid === idProduct);
  if (!product) return res.send({ error: "Producto no encontrado" });
  res.send({ product });
});

router.post("/", uploader.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo guardar la img" });
  }
  const newProduct = req.body;
  newProduct.thumbnail = req.file.path;
  newProduct.status = true;
  newProduct.pid = uuidv4();
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put("/:pid", (req, res) => {
  const productBuscado = req.params.pid;
  const actualizarProduct = req.body;
  products[productBuscado] = actualizarProduct;
  res.send({ status: "succes", message: "Producto actualizado" });
});

router.delete("/:pid", (req, res) => {
  const idProduct = req.params.pid;

  const productIndex = products.findIndex((u) => u.pid === idProduct);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  products.splice(productIndex, 1);
  res.status(204).json({ mensaje: "Producto eliminado" });
});
export default router;
