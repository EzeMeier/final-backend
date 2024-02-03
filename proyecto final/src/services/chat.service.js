import { chatsDao } from "../dao/index.js";

export class ChatService {
  //get messagges
  static getMessages = () => {
    return chatsDao.getMessages();
  };
  //add messagge
  static addMessage = (data) => {
    return chatsDao.addMessage(data);
  };
}
