import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import "dotenv/config";

const requester = supertest("http://localhost:8080");

describe("Carrito API", function () {
  let cookie;
  let cid = "";
  let pid = "670c105b7a5d5035cb45f25a";

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

  it("Debería crear un carrito", async () => {
    const res = await requester
      .post("/api/carts")
      .set("Cookie", `${cookie.name}=${cookie.value}`)
      .send({});

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id").that.is.a("string");
    cid = res.body._id;
  });

  it("Debería obtener un carrito por ID", async () => {
    const res = await requester
      .get(`/api/carts/${cid}`)
      .set("Cookie", `${cookie.name}=${cookie.value}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id", cid);
  });

  it("Debería agregar un producto al carrito", async () => {
    const res = await requester
      .post(`/api/carts/${cid}/product/${pid}`)
      .set("Cookie", `${cookie.name}=${cookie.value}`)
      .send({ quantity: 2 });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("products").that.is.an("array");
  });

  it("Debería eliminar un producto del carrito", async () => {
    const res = await requester
      .delete(`/api/carts/${cid}/products/${pid}`)
      .set("Cookie", `${cookie.name}=${cookie.value}`);

    expect(res.status).to.equal(200);
  });

  it("Debería vaciar un carrito", async () => {
    const res = await requester
      .delete(`/api/carts/${cid}`)
      .set("Cookie", `${cookie.name}=${cookie.value}`);

    expect(res.status).to.equal(200);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
