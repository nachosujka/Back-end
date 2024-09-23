import express from "express";
import path from "path";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import { products } from "./routes/products.router.js";
import { writeFile } from "./routes/products.router.js";
const app = express();

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
app.use("/static", express.static(publicPath));

app.use("/", viewsRouter);
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});
app.get("/home", (req, res) => {
  res.render("home");
});
const httpServer = app.listen(8080, () => {
  console.log("Servidor iniciado");
});
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  console.log("Ingreso un nuevo cliente");

  socket.emit("productsActualizados", products);

  // Escuchar el evento para agregar un nuevo producto
  socket.on("nuevoProducto", (newProduct) => {
    products.push(newProduct); // Agregar el nuevo producto al array
    writeFile(products); // Guardar los productos en el archivo
    socketServer.emit("productsActualizados", products); // Notificar a  los clientes
  });

  // Escuchar el evento para eliminar un producto
  socket.on("eliminarProducto", (productName) => {
    const productIndex = products.findIndex((p) => p.name === productName);
    if (productIndex !== -1) {
      products.splice(productIndex, 1); // Eliminar el producto del array
      writeFile(products); // Guardar los cambios en el archivo
      socketServer.emit("productsActualizados", products); // Notificar a todos los clientes
      socket.emit("productoEliminado", productName); // Emitir el evento de producto eliminado
    } else {
      socket.emit("productoNoEncontrado", productName); // Notificar si no se encontró el producto
    }
  });
});
