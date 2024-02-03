import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";

export class ViewsController {
  //shop
  static shop = async (req, res) => {
    try {
      const { limit = 3, page = 1, sort = { price: 1 } } = req.query;
      const query = {};
      const options = {
        limit,
        page,
        sort,
        lean: true,
      };
      const products = await ProductsService.getProductsPaginate(
        query,
        options
      );

      const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      const data = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? //reemplaza la pagina actual, por la pagina anterior
            `${baseUrl.replace(
              `page=${products.page}`,
              `page=${products.prevPage}`
            )}`
          : null,
        nextLink: products.hasNextPage
          ? baseUrl.includes("page")
            ? baseUrl.replace(
                `page=${products.page}`,
                `page=${products.nextPage}`
              )
            : baseUrl.concat(`?page=${products.nextPage}`)
          : null,
      };
      res.render("shop", data);
    } catch (error) {
      res.render({ error: error.message });
    }
  };

  //real time products
  static products = (req, res) => {
    res.render("realTime");
  };
  //chat
  static chat = (req, res) => {
    res.render("chat");
  };
  //cart
  static cart = async (req, res) => {
    try {
      const cid = "656915f9d275608fc814127f";
      const cart = await CartsService.getCartById(cid);
      if (!cart) {
        return res.render("el carrito no fue encontrado");
      } else {
        res.render("cart", { cart});
      }
    } catch (error) {
      res.render({ error: error.message });
    }
  };

  //sign up
  static signup = (req, res) => {
    res.render("signup");
  };
  //login
  static login = (req, res) => {
    res.render("login");
  };
  //forgot password
  static forgotPassword = (req, res) => {
    res.render("forgotPassword");
  };
  //reset password
  static resetPassword = (req, res) => {
    const token = req.query.token;
    res.render("resetPassword", { token});
  };
  //profile
  static profile = (req, res) => {
    let { message } = req.query;
    res.render("profile", { message});
  };
}
