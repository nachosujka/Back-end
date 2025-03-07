import express from "express";
import path from "path";
import __dirname from "./dirname.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import { initializePassport } from "./config/passport.config.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

const app = express();
dotenv.config();
const PORT = 8080;

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Documentacion de API de productos",
      description: "Api de proyecto sobre ecommerce",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use(cookieParser(process.env.SECRET_COOKIES));
mongoose
  .connect(process.env.URIMONGO)
  .then(() => console.log("DB is connected"))
  .catch((e) => console.log("Error al conectarme a DB:", e));
initializePassport();
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.URIMONGO,
      mongoOptions: {},
      ttl: 15,
    }),
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Cambia a `true` si usas HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
    name: "coderCookie",
  })
);
app.use(passport.session());
app.use(passport.initialize());
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
app.use("/api/docs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
app.use("/api", indexRouter);
const publicPath = path.join(__dirname, "public");

app.use("/static", express.static(publicPath));

app.get("/product", (req, res) => {
  res.render("product");
});

app.get("/newProduct", (req, res) => {
  res.render("newProduct");
});

const httpServer = app.listen(PORT, () => {
  console.log("Servidor iniciado");
});
