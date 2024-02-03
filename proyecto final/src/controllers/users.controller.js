import { UsersService } from "../services/users.service.js";

export class usersController {
  static modifyRole = async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await UsersService.getUserById(uid);
      if (user.status !== "complete") {
        res.json({
          status: "error",
          message: "el usuario no puede modificar todos los documentos",
        });
      }
      if (user.role === "premium") {
        user.role = "user";
      } else if (user.role === "user") {
        user.role = "premium";
      } else {
        res.json({ status: "error", message: "Debe modificar el rol del usuario" });
      }
      await UsersService.updateUser(user._id, user);
      res.json({
        status: "success",
        message: "usuario modificado satisfactoriamente",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //upload documents
  static uploadDocuments = async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await UsersService.getUserById(uid);
      const identification = req.files["identification"]?.[0] || null;
      const residence = req.files["residence"]?.[0] || null;
      const accountStatus = req.files["accountStatus"]?.[0] || null;
      const docs = [];
      if (identification) {
        docs.push({
          name: "identification",
          reference: identification.filename,
        });
      }
      if (residence) {
        docs.push({
          name: "residence",
          reference: residence.filename,
        });
      }
      if (accountStatus) {
        docs.push({
          name: "accountStatus",
          reference: accountStatus.filename,
        });
      }
      user.documents = docs;
      if (docs.length < 3) {
        user.status = "incomplete";
      } else {
        user.status = "complete";
      }
      await UsersService.updateUser(uid, user);
      res.json({
        status: "success",
        message: "documentos modificados satisfactoriamente",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
}
