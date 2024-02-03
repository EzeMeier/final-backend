import { __dirname } from "../utils.js";
import { ProductsManagerMongo } from "./mongo/productsManagerMongo.js";
import { CartsManagerMongo } from "./mongo/cartsManagerMongo.js";
import { ChatManagerMongo } from "./mongo/chatManagerMongo.js";
import { UsersManagerMongo } from "./mongo/usersManagerMongo.js";
import { TikcketsManagerMongo } from "./mongo/ticketsManagerMongo.js";

export const productsDao = new ProductsManagerMongo();
export const cartsDao = new CartsManagerMongo();
export const chatsDao = new ChatManagerMongo();
export const usersDao = new UsersManagerMongo();
export const ticketsDao = new TikcketsManagerMongo();
