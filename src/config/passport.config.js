import passport from "passport";
import local from "passport-local";
import { userDao } from "../dao/user.dao.js";
import googole from "passport-google-oauth20";
import "dotenv/config";
import jwt from "passport-jwt";
import { createHash } from "../utils/hashPassword.js";

const LocalStrategy = local.Strategy;
const GoogleStrategy = googole.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookie"];
    console.log("Token extraído de la cookie:", token);
  }
  return token;
};

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, password, age } = req.body;

          const findUser = await userDao.getByEmail(email);

          //Si usuario existe
          if (!findUser) {
            const user = await userDao.create({
              first_name: first_name,
              last_name: last_name,
              email: email,
              password: createHash(password),
              age: age,
            });
            return done(null, user); //Doy aviso de que genere un nuevo usuario
          } else {
            return done(null, false); //No devuelvo error pero no genero un nuevo usuario
          }
        } catch (e) {
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userDao.getByEmail(username);
          if (!user || !isValidPassword(password, user.password)) {
            return done(null, false, {
              message: "Email o contraseña no valido",
            });
          }
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.PASSWORD_JWT,
      },
      async (jwt_payload, done) => {
        try {
          console.log(jwt_payload);
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDao.getById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/session/google",
      },
      async (accesToken, refreshToken, profile, cb) => {
        try {
          const { id, name, emails } = profile;
          const user = {
            first_name: name.givenName,
            last_name: name.familyName,
            email: emails[0].value,
          };
          const existingUser = await userDao.getByEmail(user.email);
          if (existingUser) {
            return cb(null, existingUser);
          }
          const newUser = await userDao.create(user);
          return cb(null, newUser);
        } catch (error) {
          return cb(error);
        }
      }
    )
  );
};
