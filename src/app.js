import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { url } from "inspector";

const app = express();

app.listen(8080, () => {
  console.log("Servidor iniciado");
});

app.use(express.json);
app.use(express.urlencoded)({ extended: true });
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date()}`);
  next();
});
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

const __dirname = dirname(fileURLToPath(import.meta, url));
const publicPath = path.join(__dirname, "public");
app.use("/static", express.static(path.join(publicPath)));
