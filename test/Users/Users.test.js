import mongoose from "mongoose";
import userModel from "../../src/models/user.model.js";
import Assert from "assert";
import { describe, it } from "mocha";
import crypto from "crypto";
const assert = Assert.strict;

describe("Testing users", function () {
  let idUser;
  before(async () => {
    await mongoose.connect(
      "mongodb+srv://nachosujka:nacho62246@coderhouse.ynbgn.mongodb.net/?retryWrites=true&w=majority&appName=CoderHouse"
    );
    console.log("DB esta conectado");
  });

  it("Crear usuario", async () => {
    const mockUser = {
      first_name: "Nacho",
      last_name: "Sujka",
      email: `nacho${crypto.randomBytes(5).toString("hex")}@nacho.com`,
      password: "coder",
      age: "18",
    };
    const newUser = await userModel.create(mockUser);
    idUser = newUser._id;
    assert.deepStrictEqual(typeof newUser.email, "string");
  });

  it("Obtener todos los usuarios", async () => {
    const users = await userModel.find();
    assert.strictEqual(Array.isArray(users), true);
  });

  it("Obtener un usuario", async () => {
    const user = await userModel.findById(idUser);
    assert.strictEqual(typeof user, "object");
  });

  it("Actualizar un usuario", async () => {
    const mockUpdate = {
      first_name: "Leandro",
      last_name: "Sujka",
      email: `nacho${crypto.randomBytes(5).toString("hex")}@nacho.com`,
      password: "coder",
      age: "18",
    };
    const userUpdate = await userModel.findByIdAndUpdate(idUser, mockUpdate);
    assert.deepStrictEqual(typeof userUpdate.email, "string");
  });

  it("Eliminar un usuario", async () => {
    const deleteUser = await userModel.findByIdAndDelete(idUser);
    let rta = await userModel.findById(deleteUser._id);
    assert.strictEqual(rta, null);
  });
  after(async function () {
    await mongoose.disconnect();
    console.log("DB esta desconectado");
  });
});
