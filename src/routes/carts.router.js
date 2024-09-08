import { error } from "console";
import { Router } from "express";
const router = Router();

router.post("/", (req, res) => {
  let car = [];
  let products = [];
  car.push(products);
  car.cid = uuidv4();
  res.json(car);
});

router.get("/:cid", (req, res) => {
  res.send(`${req.params.cid}`);
});

router.post("/:cid/products/:pid", (req, res) => {
  const product = req.params.pid;
  const idCar = req.params.cid;
  let quantity = 1;
  product.push(quantity);
  if (product.pid) {
    return res.send(quantity++);
  }
  car.idCar.products.push(product);
  res.json(product);
});

export default router;
