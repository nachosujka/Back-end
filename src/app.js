import express from "express";
import path from "path";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import productModel from "./models/product.model.js";

const app = express();
dotenv.config();

const uriConexion = process.env.URIMONGO;
mongoose.connect(uriConexion);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(methodOverride("_method"));
app.use(express.json()); //fundamental para trabajar con json y recibir correctamente archivos del body
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date()}`);
  next();
});
app.use("/carts", cartsRouter);
app.use("/products", productsRouter);

const publicPath = path.join(__dirname, "public");
app.use("/static", express.static(publicPath));

app.get("/product", (req, res) => {
  res.render("product");
});

app.get("/newProduct", (req, res) => {
  res.render("newProduct");
});

const httpServer = app.listen(8080, () => {
  console.log("Servidor iniciado");
});
// const socketServer = new Server(httpServer);
// socketServer.on("connection", (socket) => {
//   console.log("Ingreso un nuevo cliente");

//   socket.emit("productsActualizados", products);

//   // Escuchar el evento para agregar un nuevo producto
//   socket.on("newProduct", (newProduct) => {
//     products.push(newProduct); // Agregar el nuevo producto al array
//     writeFile(products); // Guardar los productos en el archivo
//     socketServer.emit("productsActualizados", products); // Notificar a  los clientes
//   });

//   // Escuchar el evento para eliminar un producto
//   socket.on("eliminarProducto", (productName) => {
//     const productIndex = products.findIndex((p) => p.name === productName);
//     if (productIndex !== -1) {
//       products.splice(productIndex, 1); // Eliminar el producto del array
//       writeFile(products); // Guardar los cambios en el archivo
//       socketServer.emit("productsActualizados", products); // Notificar a todos los clientes
//       socket.emit("productoEliminado", productName); // Emitir el evento de producto eliminado
//     } else {
//       socket.emit("productoNoEncontrado", productName); // Notificar si no se encontro el producto
//     }
//   });
// });
