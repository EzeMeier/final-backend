import { Router } from "express";
import { ViewsController } from "../controllers/views.controller.js";
import { checkRole, isAuth } from "../middlewares/auth.js";
import { logger } from "../helpers/logger.js";

const router = Router();

//shop
router.get("/shop", ViewsController.shop);
//real time products
router.get("/realTimeProducts", ViewsController.products);
//chat
router.get("/chat", isAuth, checkRole(["user"]), ViewsController.chat);
//cart
router.get("/cart", ViewsController.cart);
//sign up
router.get("/signup", ViewsController.signup);
//login
router.get("/login", ViewsController.login);
//forgot password
router.get("/forgot-password", ViewsController.forgotPassword);
//reset password
router.get("/reset-password", ViewsController.resetPassword);
//profile
router.get("/profile", ViewsController.profile);
//LOGGER TEST
router.get("/testLogger", (req, res) => {
  logger.error("log error");
  logger.warning("log warning");
  logger.debbug("log debbug");
  res.send("prueba logger");
});

export { router as viewsRouter };
