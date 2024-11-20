import express from "express";
import ProductModel from "../models/product.model.js";
import { uploader } from "../dirname.js";
import methodOverride from "method-override";
import { authorization } from "../middlewares/authorization.middleware.js";
import { productDao } from "../dao/product.dao.js";
const router = express.Router();

router.get("/", authorization("user"), async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;

    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        price: sort === "asc" ? 1 : -1,
      },
      learn: true,
    };

    // Si nos solicitan por categoría
    if (category) {
      const products = await productDao.getAll({ category }, options);
      return res.status(200).json({ status: "success", products });
    }

    if (status) {
      const products = await productDao.getAll({ status }, options);
      return res.status(200).json({ status: "success", products });
    }

    const products = await productDao.getAll({}, options);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
});

router.get("/:pid", authorization("user"), async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productDao.getById(productId); // Busca el producto por ID

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

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const productData = req.body;
    const product = await productDao.update(productId, productData);
    if (!product)
      return res
        .status(404)
        .json({ status: "Error", msg: "Producto no encontrado" });

    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});
router.post("/newProduct", uploader.single("file"), async (req, res) => {
  try {
    const newProductData = req.body; // Verifica datos enviados desde el formulario

    if (req.file) {
      newProductData.thumbnail = `/img/${req.file.filename}`;
    }

    const newProduct = await productDao.create(newProductData);

    await newProduct.save();
    res.redirect("/products");
  } catch (error) {
    return res.render("error", { error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productDao.deleteOne(productId);
    if (!product) {
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
