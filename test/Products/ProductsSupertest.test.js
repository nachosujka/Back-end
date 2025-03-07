import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import crypto from "crypto";
import "dotenv/config";

const requester = supertest("http://localhost:8080");

describe("Rutas de Productos (CRUD)", function () {
  let createdProductId;

  before(async () => {
    try {
      await mongoose.connect(process.env.URIMONGO);
      console.log("Conexión exitosa a MongoDB");
      await mongoose.connection.db.collection("products").deleteMany({});
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
    }
  });

  it("POST /api/products - Debería crear un producto", async () => {
    const testProduct = {
      nombre: "Producto de prueba",
      precio: 99.99,
      descripcion: "Descripcion de prueba",
      codigo: `TEST-${crypto.randomBytes(4).toString("hex")}`,
      stock: 10,
      categoria: "prueba",
    };

    const response = await requester.post("/api/products").send(testProduct);

    expect(response.statusCode).to.equal(200);
    expect(response.body.product).to.be.an("object");
    expect(response.body.product.nombre).to.equal(testProduct.nombre);
    createdProductId = response.body.product._id;
  });

  it("GET /api/products - Deberia listar productos con paginacion", async () => {
    const response = await requester.get("/api/products?limit=5&page=1");

    expect(response.statusCode).to.equal(200);
    expect(response.body.products.docs).to.be.an("array");
    expect(response.body.products.docs.length).to.be.greaterThan(0);
  });

  it("GET /api/products/:pid - Deberia obtener un producto por ID", async () => {
    const response = await requester.get(`/api/products/${createdProductId}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body.product).to.be.an("object");
    expect(response.body.product._id).to.equal(createdProductId);
  });

  it("PUT /api/products/:pid - Deberia actualizar un producto", async () => {
    const updatedData = { precio: 199.99 };

    const response = await requester
      .put(`/api/products/${createdProductId}`)
      .send(updatedData);

    expect(response.statusCode).to.equal(200);
    expect(response.body.product.precio).to.equal(updatedData.precio);
  });

  it("DELETE /api/products/:pid - Deberia eliminar un producto", async () => {
    const response = await requester.delete(
      `/api/products/${createdProductId}`
    );

    expect(response.statusCode).to.equal(200);
    expect(response.body.product._id).to.equal(createdProductId);

    const checkResponse = await requester.get(
      `/api/products/${createdProductId}`
    );
    expect(checkResponse.statusCode).to.equal(404);
  });
  after(async () => {
    await mongoose.connection.close();
  });
});
