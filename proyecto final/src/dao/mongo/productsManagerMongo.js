import { productsModel } from "./models/products.model.js";
import { EError } from "../../enums/EError.js";
import { CustomError } from "../../services/errors/customError.service.js";
import {
  addProductError,
  updateProductError,
  deleteProductError,
} from "../../services/errors/createError.service.js";
import { logger } from "../../helpers/logger.js";

export class ProductsManagerMongo {
  constructor() {
    this.model = productsModel;
  }

  //get products
  async getProducts() {
    try {
      const result = await this.model.find().lean();
      return result;
    } catch (error) {
      logger.error(`error al conseguir el producto: ${error.message}`);
      throw new Error(`error al conseguir el producto: ${error.message}`);
    }
  }

  //get products paginate
  async getProductsPaginate(query, options) {
    try {
      const result = await this.model.paginate(query, options);
      return result;
    } catch (error) {
      logger.error(`error al obtener los productos: ${error.message}`);
      throw new Error(`error al obtener los productos: ${error.message}`);
    }
  }

  //add product
  async addProduct(productInfo) {
    try {
      const result = await this.model.create(productInfo);
      return result;
    } catch (error) {
      const errorAddProduct = CustomError.createError({
        name: "error al agregar el producto",
        cause: addProductError(),
        message: addProductError(),
        code: EError.PRODUCTS_ERROR,
      });
      logger.error(errorAddProduct);
      throw new Error(errorAddProduct);
    }
  }

  //get product by ID
  async getProductById(id) {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (error) {
      logger.error(`error al obtener el ID del producto: ${error.message}`);
      throw new Error(`el producto con el siguiente ID ${id} no fue encontrado`);
    }
  }

  //update product
  async updateProduct(id, updatedContent) {
    try {
      const result = await this.model.findByIdAndUpdate(id, updatedContent, {
        new: true,
      });
      return result;
    } catch (error) {
      const errorUpdateProduct = CustomError.createError({
        name: "error al modificar el producto",
        cause: updateProductError(),
        message: updateProductError(),
        code: EError.PRODUCTS_ERROR,
      });
      logger.error(errorUpdateProduct);
      throw new Error(errorUpdateProduct);
    }
  }

  //update product stock
  async updateProductStock(id, data) {
    try {
      const result = await this.model.updateMany(
        { _id: id },
        { $set: data },
        { new: true }
      );
      if (!result) {
        throw new Error("producto no econtrado");
      } else {
        return result;
      }
    } catch (error) {
      logger.error(`error al modificar el stock del producto: ${error.message}`);
      throw new Error(`error al modificar el stock del producto: ${error.message}`);
    }
  }

  //delete product
  async deleteProduct(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        throw new Error(deleteProductError());
      } else {
        return result;
      }
    } catch (error) {
      const errorDeleteProduct = CustomError.createError({
        name: "error al eliminar el producto",
        cause: deleteProductError(),
        message: deleteProductError(),
        code: EError.PRODUCTS_ERROR,
      });
      logger.error(errorDeleteProduct);
      throw new Error(errorDeleteProduct);
    }
  }
}
