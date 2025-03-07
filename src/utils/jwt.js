import jwt from "jsonwebtoken";
import "dotenv/config";

export const createToken = (user) => {
  const token = jwt.sign({ user }, process.env.PASSWORD_JWT, {
    expiresIn: "24h",
  });
  return token;
};

export const verifyToken = (token) => {
  //Es una funcion que verifica el token
  try {
    const decode = jwt.verify(token, process.env.PASSWORD_JWT);
    return decode;
  } catch (error) {
    return null;
  }
};
