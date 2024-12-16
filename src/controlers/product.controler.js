import { ProductResponseDto } from "../dto/productResponse.dto.js";
import { productDao } from "../dao/product.dao.js";
import { productService } from "../services/product.services.js";

export class ProductControler {
  async getAll(req, res) {
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
      res
        .status(500)
        .json({ status: "Erro", msg: "Error interno del servidor" });
    }
  }

  async getById(req, res) {
    try {
      const { pid } = req.params;
      const product = await productService.getById(pid); // Busca el producto por ID

      if (!product) {
        return res
          .status(404)
          .json({ status: "error", Error: "Producto no encontrado" });
      }

      res.status(200).json({ status: "success", product }); // Renderiza la vista de detalles del producto
    } catch (error) {
      return res.status(500).render("error", {
        Error: "Error al obtener el producto",
      });
    }
  }

  async update(req, res) {
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
  }

  async create(req, res) {
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
  }

  async deleteOne(req, res) {
    try {
      const { pid } = req.params;
      const product = await productService.deleteOne(pid);
      if (!product) {
        return res
          .status(404)
          .render("error", { error: "Error al eliminar el producto" });
      }
      res.redirect("products");
    } catch (error) {
      return res.render("error", { error: "Error al eliminar el producto" });
    }
  }
}
