import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
import { SessionControler } from "../controllers/session.controller.js";

const sessionControler = new SessionControler();
const router = Router();

router.post(
  "/register",
  passport.authenticate("register"),
  sessionControler.register
);

router.post("/login", passport.authenticate("login"), sessionControler.login);

router.get("/logout", sessionControler.logout);

router.get("/current", passport.authenticate("jwt"), (req, res) => {
  res.status(200).send(req.user);

  if (!req.user) {
    return res.status(401).send({ error: "Unauthorized - req.user vacío" });
  }

  res.status(200).send(req.user);
});

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
