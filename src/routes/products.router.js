import express from "express";
import ProductModel from "../models/product.model.js";
import { uploader } from "../dirname.js";
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
    const newProductData = req.body; // Verifica datos enviados desde el formulario

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
