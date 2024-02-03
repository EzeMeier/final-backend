import { usersModel } from "./models/users.model.js";
import { logger } from "../../helpers/logger.js";

export class UsersManagerMongo {
  constructor() {
    this.model = usersModel;
  }

  //add user
  async addUser(userInfo) {
    try {
      const result = await this.model.create(userInfo);
      return result;
    } catch (error) {
      logger.error(`error al agregar el usuario: ${error.message}`);
      throw new Error(`error al agregar el usuario: ${error.message}`);
    }
  }

  //get user by ID
  async getUserById(id) {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (error) {
      logger.error(`error al conseguir el usuario por ID: ${error.message}`);
      throw new Error(`error al conseguir el usuario por ID: ${error.message}`);
    }
  }

  //get user by email
  async getUserByEmail(email) {
    try {
      const result = await this.model.findOne({ email: email }).lean();
      return result;
    } catch (error) {
      logger.error(`error al obtener el email del usuario: ${error.message}`);
      throw new Error(`error al obtener el email del usuario: ${error.message}`);
    }
  }

  //update user
  async updateUser(id, user) {
    try {
      const result = await this.model.findByIdAndUpdate(id, user, {
        new: true,
      });
      return result;
    } catch (error) {
      logger.error(`error al modificar el usuario: ${error.message}`);
      throw new Error(`error al modificar el usuario: ${error.message}`);
    }
  }
}
