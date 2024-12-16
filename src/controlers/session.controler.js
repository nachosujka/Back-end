import { UserResponseDto } from "../dto/user.dto.js";
import { createToken } from "../utils/jwt.js";
export class SessionControler {
  async register(req, res) {
    //Obtengo los datos del body y creo un usuario
    try {
      res.status(201).json({ status: "success", msg: "Usuario registrado" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Error", msg: "Error interno del servidor" });
    }
  }

  async login(req, res) {
    //En caso de tener una cuenta ya creada inicio sesion
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
  }

  async logout(req, res) {
    try {
      req.session.destroy(); //Cierro la sesion
      res.status(200).json({ status: "success", msg: "Sesion cerrada" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Error", msg: "Error interno en el servidor" });
    }
  }

  async current(req, res) {
    //Obtengo los datos de la sesion
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

  async googleAuth(req, res) {
    //Inicio sesion usando google
    try {
      res.status(200).json({ status: "success", payload: req.user });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Error", msg: "Error interno del servidor" });
    }
  }
}
