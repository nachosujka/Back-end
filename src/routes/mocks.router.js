import { Router } from "express";
import { faker } from "@faker-js/faker";
import userModel from "../models/user.model.js";
import { createHash } from "../utils/hashPassword.js";

const mocksRouter = Router();

mocksRouter.get("mockingusers", async (req, res) => {
  try {
    const users = [];
    for (let i = 0; i < 50; i++) {
      users.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: createHash("coder123"),
        age: faker.number.int({ min: 18, max: 100 }),
        rol: Math.random() < 0.9 ? "User" : "Admin",
      });
    }
    const mensaje = await userModel.insertMany(users);
    res.status(200).send(mensaje);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default mocksRouter;
