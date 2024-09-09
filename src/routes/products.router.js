import { error } from "console";
import path from "path";
import { Router } from "express";
import { uploader } from "../utils.js";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "products.json");

const readFile = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

let products = readFile();

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
  writeFile(products);
  res.status(201).json(newProduct);
});

router.put("/:pid", (req, res) => {
  const productBuscado = req.params.pid;
  const actualizarProduct = req.body;
  products[productBuscado] = actualizarProduct;
  writeFile(products);
  res.send({ status: "succes", message: "Producto actualizado" });
});

router.delete("/:pid", (req, res) => {
  const idProduct = req.params.pid;

  const productIndex = products.findIndex((u) => u.pid === idProduct);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  products.splice(productIndex, 1);
  writeFile(products);
  res.status(204).json({ mensaje: "Producto eliminado" });
});
export default router;
