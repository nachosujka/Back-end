// import { error } from "console";
// import path from "path";
// import { Router } from "express";
// import { uploader } from "../utils.js";
// import { fileURLToPath } from "url";
// import { v4 as uuidv4 } from "uuid";
// import fs from "fs";
// import ProductModel from "../models/product.model.js";
// import methodOverride from "method-override";

// const router = Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const filePath = path.join(__dirname, "products.json");

// const readFile = () => {
//   if (!fs.existsSync(filePath)) return [];
//   const data = fs.readFileSync(filePath);
//   return JSON.parse(data);
// };

// export const writeFile = (data) => {
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
// };

// export let products = readFile();

// router.use((req, res, next) => {
//   console.log(`${req.method} ${req.path} - ${new Date()}`);
//   next();
// });

// router.get("/list", (req, res) => {
//   const limit = parseInt(req.query.limit) || 10;
//   const productsWithLimit =
//     products.length <= limit ? products : products.slice(0, limit);
//   res.render("home", { products: productsWithLimit });
// });
// // router.get("/", (req, res) => {
// //   const limit = parseInt(req.query.limit) || 10;
// //   const productsWithLimit =
// //     products.length <= limit ? products : products.slice(0, limit);
// //   res.render("realTimeProducts", { products: productsWithLimit });
// // });

// router.get("/:pid", (req, res) => {
//   const idProduct = req.params.pid;

//   let product = products.find((u) => u.pid === idProduct);
//   if (!product) return res.send({ error: "Producto no encontrado" });
//   res.send({ product });
// });

// router.post("/", uploader.single("file"), (req, res) => {
//   if (!req.file) {
//     return res
//       .status(400)
//       .send({ status: "error", error: "No se pudo guardar la img" });
//   }
//   const newProduct = req.body;
//   newProduct.thumbnail = req.file.path;
//   newProduct.status = true;
//   newProduct.pid = uuidv4();
//   products.push(newProduct);
//   writeFile(products);
//   res.status(201).json(newProduct);
// });

// router.put("/:pid", (req, res) => {
//   const productBuscado = req.params.pid;
//   const actualizarProduct = req.body;
//   products[productBuscado] = actualizarProduct;
//   writeFile(products);
//   res.send({ status: "succes", message: "Producto actualizado" });
// });

// router.delete("/:pid", (req, res) => {
//   const idProduct = req.params.pid;

//   const productIndex = products.findIndex((u) => u.pid === idProduct);
//   if (productIndex === -1) {
//     return res.status(404).json({ error: "Producto no encontrado" });
//   }
//   products.splice(productIndex, 1);
//   writeFile(products);
//   res.status(204).json({ mensaje: "Producto eliminado" });
// });

// router.get("/productos", (req, res) => {
//   const limit = parseInt(req.query.limit) || 10;
//   const productsWithLimit =
//     products.length <= limit ? products : products.slice(0, limit);
//   res.render("realTimeProducts", { products: productsWithLimit });
// });

// export default router;
import express from "express";
import ProductModel from "../models/product.model.js";
import { uploader } from "../utils.js";
import methodOverride from "method-override";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find();
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    if (!page) page = 1;
    if (!limit) limit = 10;
    let result = await ProductModel.paginate({}, { page, limit, lean: true });
    result.prevLink = result.hasPrevPage
      ? `http://localhost:8080/products?page=${result.prevPage}&limit=${limit}`
      : "";
    result.nextLink = result.hasNextPage
      ? `http://localhost:8080/products?page=${result.nextPage}&limit=${limit}`
      : "";
    result.isValid = !(page <= 0 || page > result.totalPages);

    const yourCartId = "67155a750b8c086f2bdb8685";
    res.render("products", {
      products: result.docs,
      cartId: yourCartId,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevPage
        ? `/?page=${result.prevPage}&limit=${limit}`
        : null,
      nextLink: result.nextPage
        ? `/?page=${result.nextPage}&limit=${limit}`
        : null,
      page: result.page,
      isValid: result.isValid,
    });
  } catch (error) {
    return res.render("error", {
      Error: "Error al obtener todos los productos",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId); // Busca el producto por ID

    if (!product) {
      return res.status(404).render("error", {
        Error: "Producto no encontrado",
      });
    }

    res.render("product", { product: product.toObject() }); // Renderiza la vista de detalles del producto
  } catch (error) {
    return res.status(500).render("error", {
      Error: "Error al obtener el producto",
    });
  }
});

router.get("/productJson", async (req, res) => {
  const { categoria, disponibilidad, order } = req.query;

  let filter = {};
  if (categoria) filter.categoria = categoria;
  if (disponibilidad)
    filter.stock = disponibilidad === "true" ? { $gt: 0 } : { $lte: 0 };

  let sortOption = { precio: order === "desc" ? -1 : 1 };

  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);

  if (!page) page = 1;
  if (!limit) limit = 10;
  let result = await ProductModel.paginate(filter, {
    page,
    limit: limit,
    lean: true,
    select: "-__v",
    sort: sortOption,
  });

  result.status = result.docs ? "success" : "error";
  result.payload = result.docs;
  delete result.docs;
  result.payload.forEach((doc) => delete doc.id);
  result.prevLink = result.hasPrevPage
    ? `http://localhost:8080/products?page=${result.prevPage}&limit=${limit}`
    : "";
  result.nextLink = result.hasNextPage
    ? `http://localhost:8080/products?page=${result.nextPage}&limit=${limit}`
    : "";
  result.isValid = !(page <= 0 || page > result.totalPages);
  res.json(result);
});

router.post("/newProduct", uploader.single("file"), async (req, res) => {
  try {
    const newProductData = req.body; // Verificar datos enviados desde el formulario

    if (req.file) {
      newProductData.thumbnail = `/img/${req.file.filename}`;
    }

    const newProduct = new ProductModel(newProductData);

    await newProduct.save();
    res.redirect("/products");
  } catch (error) {
    return res.render("error", { error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await ProductModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res
        .status(404)
        .render("error", { error: "Error al eliminar el producto" });
    }
    res.redirect("products");
  } catch (error) {
    return res.render("error", { error: "Error al eliminar el producto" });
  }
});
export default router;
