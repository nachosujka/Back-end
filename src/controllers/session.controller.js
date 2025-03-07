import { userDao } from "../dao/user.dao.js";
import { createToken } from "../utils/jwt.js";
export class SessionControler {
  async register(req, res) {
    try {
      if (!req.user) {
        //Consulto si en la sesion se encuentra mi usuario
        return res.status(400).send("El mail ya se encuentra registrado");
      }
      res.status(201).send("Usuario creado correctamente");
    } catch (e) {
      console.log(e);
      res.status(500).send("Error al registrar usuario");
    }
  }

  async login(req, res) {
    //En caso de tener una cuenta ya creada inicio sesion
    try {
      const token = createToken(req.user);
      req.session.user = {
        email: req.user.email,
        first_name: req.user.first_name,
      };

      res
        .status(200)
        .cookie("coderCookie", token, { httpOnly: true })
        .json({ status: "success", payload: req.user });
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

  // async current(req, res) {
  //   //Obtengo los datos de la sesion
  //   try {
  //     const user = await userDao.getById(req.user.id);
  //     res.status(200).json({ status: "success", payload: req.user });
  //   } catch (error) {
  //     console.log(error);
  //     res
  //       .status(500)
  //       .json({ status: "Error", msg: "Error interno en el servidor" });
  //   }
  // }

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
