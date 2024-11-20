import passport from "passport";
import { Strategy } from "passport-local";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(401).json({ status: "error", msg: info.message });
      req.user = user;
      next();
    });
    req, res, next;
  };
};