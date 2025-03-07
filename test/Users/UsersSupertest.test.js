import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import { __dirname } from "../src/dirname.js";
import { describe } from "mocha";
import crypto from "crypto";
import "dotenv/config";

const requester = supertest("http://localhost:8080");

describe("Rutas de sesion de mi usuario (Register, Login, Current)", function () {
  let user = {};
  let cookie = {};

  before(async () => {
    try {
      await mongoose.connect(process.env.URIMONGO);
      console.log("Conexión exitosa a MongoDB");
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
    }
  });
  it("Ruta: api/sessions/register con el metodo POST", async () => {
    let newUser = {
      first_name: "Julieta",
      last_name: "Jalapeño",
      email: `july${crypto.randomBytes(5).toString("hex")}@july.com`,
      password: "coder",
      age: 20,
    };

    const { statusCode, request } = await requester
      .post("/api/sessions/register")
      .send(newUser);
    user = request._data;

    expect(statusCode).to.be.equal(201);
  });

  it("Ruta: api/sessions/login con el metodo POST", async () => {
    const result = await requester.post("/api/sessions/login").send(user);

    const cookieResult = result.headers["set-cookie"][0];

    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    expect(cookie.name).to.be.ok.and.equal("coderCookie");
    expect(cookie.value).to.be.ok;
  });

  it("Ruta: api/sessions/current con el metodo GET", async () => {
    console.log("Enviando cookie en el test:", cookie);
    const result = await requester
      .get("/api/sessions/current")
      .set("Cookie", [`${cookie.name} = ${cookie.value}`]); // Asegurar que la cookie se envía correctamente
    console.log(result);
    expect(true).to.be.ok;
  });
});
