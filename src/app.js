import express from "express";
import path from "path";
import __dirname from "./dirname.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import productModel from "./models/product.model.js";
import { initializePassport } from "./config/passport.config.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.js";

const app = express();
dotenv.config();

const uriConexion = process.env.URIMONGO;
mongoose.connect(uriConexion);

initializePassport();

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

app.use("/api", indexRouter);
const publicPath = path.join(__dirname, "public");

app.use("/static", express.static(publicPath));
app.use(
  session({
    secret: "secret",
    resave: true, // Mantiene la session activa, si esto est el false la session se cierra
    saveUninitialized: true, // Guarde la session
  })
);
app.use(cookieParser("secretKey"));

app.get("/product", (req, res) => {
  res.render("product");
});

app.get("/newProduct", (req, res) => {
  res.render("newProduct");
});

const httpServer = app.listen(8080, () => {
  console.log("Servidor iniciado");
});
