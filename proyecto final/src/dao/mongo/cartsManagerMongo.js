import { cartsModel } from "./models/carts.model.js";
import { logger } from "../../helpers/logger.js";

export class CartsManagerMongo {
  constructor() {
    this.model = cartsModel;
  }

  //add cart
  async addCart() {
    try {
      const cart = {};
      const result = await this.model.create(cart);
      return result;
    } catch (error) {
      logger.error(`add cart error: ${error.message}`);
      throw new Error(`add cart error: ${error.message}`);
    }
  }

  //get carts
  async getCarts() {
    try {
      const result = await this.model.find().lean();
      return result;
    } catch (error) {
      logger.error(`get carts error: ${error.message}`);
      throw new Error(`get carts error: ${error.message}`);
    }
  }

  //get cart by ID
  async getCartById(id) {
    try {
      const result = await this.model
        .findById(id)
        .populate("products.productId")
        .lean();
      if (!result) {
        throw new Error("el carrito no existe");
      } else {
        return result;
      }
    } catch (error) {
      logger.error(`error al obtener el ID del carrito: ${error.message}`);
      throw new Error(`error al obtener el ID del carrito: ${error.message}`);
    }
  }

  //update cart
  async updateCart(id, data) {
    try {
      const result = await this.model.updateMany(
        { _id: id },
        { $set: data },
        { new: true }
      );
      if (result.nModified === 0) {
        throw new Error("carrito no encontrado");
      } else {
        return result;
      }
    } catch (error) {
      logger.error(`error al modificar el carrito: ${error.message}`);
      throw new Error(`error al modificar el carrito: ${error.message}`);
    }
  }

  //delete cart
  async deleteCart(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        throw new Error("carrito no encontrado");
      } else {
        return result;
      }
    } catch (error) {
      logger.error(`error al eliminar el carrito: ${error.message}`);
      throw new Error(`error al eliminar el carrito: ${error.message}`);
    }
  }

  //add product to cart
  async addProduct(cid, pid) {
    try {
      //verificar si el cart existe
      const cart = await this.getCartById(cid);
      if (cart) {
        //verificar si el product existe en el cart
        const product = cart.products.find((product) => product._id == pid);
        if (product) {
          //incrementar quantity del producto
          product.quantity += 1;
        } else {
          const newProductCart = {
            productId: pid,
            quantity: 1,
          };
          cart.products.push(newProductCart);
        }
      }
      const result = await this.model.findByIdAndUpdate(cid, cart, {
        new: true,
      });
      return result;
    } catch (error) {
      logger.error(`error al agregar el producto al carrito: ${error.message}`);
      throw new Error(`error al agregar el producto al carrito: ${error.message}`);
    }
  }

  //delete product from cart
  async deleteProductCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      console.log(cart.products);
      const product = cart.products.find((product) => product.productId == pid);
      console.log(product);
      if (product) {
        const newProducts = cart.products.filter((product) => {
          return product.productId._id != pid;
        });
        cart.products = newProducts;
        const result = await this.model.findByIdAndUpdate(cid, cart, {
          new: true,
        });
        return result;
      } else {
        throw new Error("error al eliminar el producto");
      }
    } catch (error) {
      logger.error(`error al eliminar el carrito: ${error.message}`);
      throw new Error(`error al eliminar el carrito: ${error.message}`);
    }
  }

  //update product from cart
  async updateProductCart(cid, pid, newQuantity) {
    try {
      const cart = await this.getCartById(cid);
      const productIndex = cart.products.findIndex(
        (product) => product._id == pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        const result = await this.model.findByIdAndUpdate(cid, cart, {
          new: true,
        });
        return result;
      }
    } catch (error) {
      logger.error(`error al modificar el producto del carrito: ${error.message}`);
      throw new Error(`error al modificar el producto del carrito: ${error.message}`);
    }
  }
}
