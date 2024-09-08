import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";

const app = express();

app.listen(8080, () => {
  console.log("Servidor iniciado");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date()}`);
  next();
});
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "public");

console.log(publicPath);
app.use("/static", express.static(publicPath));
