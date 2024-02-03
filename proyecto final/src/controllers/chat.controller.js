import { ChatService } from "../services/chat.service.js";

export class ChatController {
  //get all messagges
  static getMessages = async (req, res) => {
    try {
      const messagges = await ChatService.getMessages();
      res.json({ status: "success", data: messagges });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
}
