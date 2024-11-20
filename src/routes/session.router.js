import { Router } from "express";
import { userDao } from "../dao/user.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import passport from "passport";
import { createToken, verifyToken } from "../utils/jwt.js";
import { passportCall } from "../middlewares/passport.middlewares.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const router = Router();

router.post("/register", passportCall("register"), async (req, res) => {
  //Obtengo los datos del body y creo un usuario
  try {
    res.status(201).json({ status: "success", msg: "Usuario registrado" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.post("/login", passportCall("login"), async (req, res) => {
  try {
    const token = createToken(req.user);

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy(); //Cierro la sesion
    res.status(200).json({ status: "success", msg: "Sesion cerrada" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno en el servidor" });
  }
});

router.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  async (req, res) => {
    try {
      const user = await userDao.getById(req.user.id);
      res.status(200).json({ status: "success", payload: req.user });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Error", msg: "Error interno en el servidor" });
    }
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    session: false,
  }),
  (req, res) => {
    res.status(200).json({ status: "success", payload: req.user });
  }
);

router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const user = await userDao.getByEmail(email);
  if (!user || !isValidPassword(password, user.password)) {
    return res
      .status(401)
      .json({ status: "error", msg: "Email o contraseña no valido" });
  }
  const token = createToken(user);
  res.cookie("token", token, { httpOnly: true });

  res.status(200).json({ status: "success", playload: { user, token } });
});
export default router;
