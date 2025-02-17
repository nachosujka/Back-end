import { productDao } from "../dao/product.dao.js";
import { ProductResponseDto } from "../dto/productResponse.dto.js";
class ProductService {
  async getAll() {
    return await productDao.getAll(query, options);
  }
  async getById(id) {
    const product = await productDao.getById(id);
    if (!product) return null;
    const productFormat = new ProductResponseDto(product);
    return product;
  }
  async deleteOne(id) {
    const product = await productDao.getById(id);
    if (!product) return null;
    await productDao.deleteOne(id);
    return true;
  }
  async update(id, data) {
    const product = await productDao.getById(id);
    if (!product) return null;
    const productUpdate = await productDao.update(id, data);
    return productUpdate;
  }
  async create(data) {
    const product = await productDao.create(data);
    return product;
  }
}

export const productService = new ProductService();
