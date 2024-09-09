import { error } from "console";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "carts.json");

const readFile = () => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

let carritos = readFile();

router.get("/", (req, res) => {
  res.json(carritos);
});
router.post("/", (req, res) => {
  let products = [];
  const cid = uuidv4();
  const newCar = {
    cid,
    products,
  };
  carritos.push(newCar);
  writeFile(carritos);
  res.status(201).json(newCar);
});

router.get("/:cid", (req, res) => {
  const idCar = req.params.cid;

  let car = carritos.find((u) => u.cid === idCar);
  if (!car) return res.send({ error: "Carrito no encontrado" });
  res.send({ products: car.products });
});

router.post("/:cid/products/:pid", (req, res) => {
  const productId = req.params.pid;
  const idCar = req.params.cid;
  let car = carritos.find((u) => u.cid === idCar);
  if (!car) return res.status(404).send({ error: "Carrito no encontrado" });

  let existingProduct = car.products.find((p) => p.pid === productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    const newProduct = {
      pid: productId,
      quantity: 1,
    };
    car.products.push(newProduct);
  }
  writeFile(carritos);
  const product = car.products.find((p) => p.pid === productId);
  res.status(201).json({
    pid: product.pid,
    quantity: product.quantity,
  });
});

export default router;
