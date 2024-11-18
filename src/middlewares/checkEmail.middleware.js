import { request, response } from "express";
import { userDao } from "../dao/user.dao.js";
export const checkEmail = async (req = request, res = response, next) => {
  try {
    const { email } = req.body; //Obtengo el email del body
    const user = await userDao.getByEmail(email); //Verifico si el email existe en la base de datos
    if (user)
      return res.status(400).json({
        status: "Error",
        msg: `El usuario con el email ${email} ya existe`,
      });
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
};
