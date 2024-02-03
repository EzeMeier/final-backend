import { Router } from "express";
import { checkRole, isAuth } from "../middlewares/auth.js";
import { usersController } from "../controllers/users.controller.js";
import { documentsUpload } from "../utils.js";

const router = Router();

router.put("/premium/:uid", checkRole(["admin"]), usersController.modifyRole);

router.post(
  "/:uid/documents",
  isAuth,
  documentsUpload.fields([
    { name: "identification", maxCount: 1 },
    { name: "residence", maxCount: 1 },
    { name: "accountStatus", maxCount: 1 },
  ]),
  usersController.uploadDocuments
);

export { router as usersRouter };
