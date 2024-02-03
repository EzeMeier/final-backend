import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { viewsRouter } from "./routes/views.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { ProductsService } from "./services/products.service.js";
import { CartsService } from "./services/carts.service.js";
import { ChatService } from "./services/chat.service.js";
import { chatsRouter } from "./routes/chat.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { connectDB } from "./config/dbConnection.js";
import { initializePassport } from "./config/passport.config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./helpers/logger.js";
import { usersRouter } from "./routes/users.routes.js";
import { swaggerSpecs } from "./config/swagger.config.js";
import swaggerUI from "swagger-ui-express";

const port = 8080;
const app = express();

//middlewares
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//passport
initializePassport();
app.use(passport.initialize());

//handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

//server
const httpServer = app.listen(port, () =>
  logger.info(`servidor corriendo en el puerto ${port}`)
);

connectDB();

//routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

app.use(errorHandler);

const io = new Server(httpServer);

//PRODUCTS
io.on("connection", async (socket) => {
  try {
    logger.info("cliente connectado");
    const products = await ProductsService.getProducts();
    socket.emit("products", products);

    socket.on("addProduct", async (dataProduct) => {
      try {
        const productToSave = {
          title: dataProduct.title,
          description: dataProduct.description,
          price: dataProduct.price,
          code: dataProduct.code,
          stock: dataProduct.stock,
          status: dataProduct.status,
          category: dataProduct.category,
          thumbnail: dataProduct.thumbnail,
        };
        await ProductsService.addProduct(productToSave);

        const updatedProducts = await ProductsService.getProducts();
        io.emit("products", updatedProducts);
      } catch (error) {
        logger.error(error);
      }
    });

    socket.on("deleteProduct", async (id) => {
      try {
        await ProductsService.deleteProduct(id);
        const updatedProducts = await ProductsService.getProducts();

        socket.emit("products", updatedProducts);
      } catch (error) {
        logger.error(error);
      }
    });
  } catch (error) {
    logger.error(error);
  }
});

///CHAT
io.on("connection", async (socket) => {
  try {
    const chat = await ChatService.getMessages();
    socket.emit("chatHistory", chat);

    socket.on("authenticated", async (data) => {
      try {
        console.log("Registro conectado:", data);
        socket.broadcast.emit("newUser", `${data} esta conectado`);
      } catch (error) {
        logger.error(error);
      }
    });

    socket.on("messageChat", async (data) => {
      try {
        if (data.message.trim() !== "") {
          chat.push(data);

          await ChatService.addMessage(data);
          const messageDB = await ChatService.getMessages();
          io.emit("chatHistory", messageDB);
        }
      } catch (error) {
        logger.error(error);
      }
    });
  } catch (error) {
    logger.error(error);
  }
});

//CART
io.on("connection", async (socket) => {
  try {
    const cart = await CartsService.getCarts();
    socket.emit("products", cart);
  } catch (error) {
    logger.error(error);
  }
});
export { app };
