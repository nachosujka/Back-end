import jwt from "jsonwebtoken";

export const createToken = (user) => {
  const { id, email } = user;
  const token = jwt.sign({ id, email }, "Clave", { expiresIn: "5m" });
  return token;
};

export const verifyToken = (token) => {
  //Es una funcion que verifica el token
  try {
    const decode = jwt.verify(token, "Clave");
    return decode;
  } catch (error) {
    return null;
  }
};
