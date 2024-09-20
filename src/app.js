import express from "express";
import path from "path";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";

const app = express();

// const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date()}`);
  next();
});
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

const publicPath = path.join(__dirname, "public");

console.log(publicPath);
app.use("/static", express.static(publicPath));
app.use("/", viewsRouter);
app.get("/home", (req, res) => {
  res.render("home");
});
// socketServer.on("connection", (socket) => {
//   console.log("Ingreso un nuevo cliente");
// });

const httpServer = app.listen(8080, () => {
  console.log("Servidor iniciado");
});
