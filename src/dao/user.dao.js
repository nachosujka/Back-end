import userModel from "../models/user.model.js";
class UserDao {
  async create(data) {
    const user = await userModel.create(data); //Creo un usuario con la data que viene del body
    return user;
  }

  async getAll() {
    const users = await userModel.find(); //Obtengo todos los usuarios
    return users;
  }

  async getById(id) {
    const user = await userModel.findById(id); //Obtengo el usuario segun el id que mande en el caso que exista
    return user;
  }

  async getByEmail(email) {
    const user = await userModel.findOne({ email }); //Obtengo el user con el email que mande en el caso que exista
  }

  async update(id, data) {
    const userUpdate = await userModel.findByIdAndUpdate(id, data, {
      //actualizo el usuario con la data que viene del body
      new: true,
    });
    return userUpdate;
  }
  async deleteOne(id) {
    //Elimino el usuario que tenga el id que mando
    const user = await userModel.deleteOne({ _id: id });

    return user;
  }
}
export const userDao = new UserDao();
