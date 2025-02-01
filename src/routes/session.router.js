import { Router } from "express";
import { userDao } from "../dao/user.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import passport from "passport";
import { createToken, verifyToken } from "../utils/jwt.js";
import { passportCall } from "../middlewares/passport.middlewares.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import { SessionControler } from "../controllers/session.controller.js";

const sessionControler = new SessionControler();
const router = Router();

router.post("/register", passportCall("register"), sessionControler.register);

router.post("/login", passportCall("login"), sessionControler.login);

router.get("/logout", sessionControler.logout);

router.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  sessionControler.current
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
  sessionControler.googleAuth
);

export default router;
