import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import "dotenv/config";

const requester = supertest("http://localhost:8080");

describe("Productos API", function () {
  let cookie;
  let pid = "";

  before(async () => {
    await mongoose.connect(process.env.URIMONGO);

    const user = {
      email: "nacho@nacho.com",
      password: "coder",
    };

    const loginRes = await requester.post("/api/sessions/login").send(user);
    const cookieResult = loginRes.headers["set-cookie"][0];

    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1].split(";")[0],
    };
  });

  it("Debería crear un producto", async () => {
    const newProduct = {
      title: "Producto de prueba",
      description: "Descripción del producto",
      price: 100,
      stock: 10,
    };

    const res = await requester
      .post("/api/products")
      .set("Cookie", `${cookie.name}=${cookie.value}`)
      .send(newProduct);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");
    pid = res.body._id;
  });

  it("Debería obtener todos los productos", async () => {
    const res = await requester
      .get("/api/products")
      .set("Cookie", `${cookie.name}=${cookie.value}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("Debería obtener un producto por ID", async () => {
    const res = await requester
      .get(`/api/products/${pid}`)
      .set("Cookie", `${cookie.name}=${cookie.value}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id", pid);
  });

  it("Debería actualizar un producto", async () => {
    const updatedProduct = {
      title: "Producto actualizado",
      price: 150,
    };

    const res = await requester
      .put(`/api/products/${pid}`)
      .set("Cookie", `${cookie.name}=${cookie.value}`)
      .send(updatedProduct);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("title", "Producto actualizado");
  });

  it("Debería eliminar un producto", async () => {
    const res = await requester
      .delete(`/api/products/${pid}`)
      .set("Cookie", `${cookie.name}=${cookie.value}`);

    expect(res.status).to.equal(200);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
