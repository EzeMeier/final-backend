import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";
const router = Router();

//get all messagges
router.get("/", ChatController.getMessages);

export { router as chatsRouter };
