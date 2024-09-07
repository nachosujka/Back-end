import { error } from "console";
import { Router } from "express";
import { uploader } from "../utils.js";
import { pid } from "process";

const router = Router();

let products = [];
router.get("/", (req, res) => {
  res.json({ products });
});

router.get("/:pid", (req, res) => {
  let idProduct = req.params.pid;

  let product = products.find((u) => u.id === idProduct);
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
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put("/:pid", (req, res) => {
  const actualizarProduct = req.params.pid;
  actualizarProduct = req.body;
  res.send({ actualizarProduct });
});

router.delete("/:pid", (req, res) => {
  let idProduct = req.params.pid;

  let product = products.find((u) => u.id === idProduct);
  res.send({ product });
});
export default router;
