import { ProductsService } from "../services/products.service.js";
import { generateProduct } from "../helpers/mock.js";
import { EError } from "../enums/EError.js";
import { CustomError } from "../services/errors/customError.service.js";
import { updateProductError } from "../services/errors/createError.service.js";
import { logger } from "../helpers/logger.js";

export class ProductsController {
  //get products
  static getProducts = async (req, res) => {
    try {
      const products = await ProductsService.getProducts();
      res.json({ status: "success", data: products });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };

  //add product
  static addProduct = async (req, res) => {
    try {
      let productInfo = req.body;
      productInfo.owner = req.user._id;

      productInfo = {
        ...productInfo,
        thumbnail: req.file.filename,
      };

      const product = await ProductsService.addProduct(productInfo);
      if (product) {
        res.json({
          status: "success",
          message: `${productInfo.title} added successfully`,
          data: product,
        });
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //get product by id
  static getProductById = async (req, res) => {
    try {
      const pid = req.params.pid;
      const product = await ProductsService.getProductById(pid);
      if (product) {
        res.json({
          status: "satisfactorio",
          data: product,
        });
      } else {
        res.json({ status: "error", message: "error al agregar producto..." });
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //update producto
  static updateProduct = async (req, res) => {
    try {
      const pid = req.params.pid;
      const updatedContent = req.body;

      const productProperties = [
        "title",
        "description",
        "price",
        "code",
        "stock",
        "category",
        "status",
        "thumbnail",
      ];

      const entries = Object.entries(updatedContent);

      for (const [clave] of entries) {
        if (!productProperties.includes(clave)) {
          const errorUpdateProduct = CustomError.createError({
            name: "error al modificar producto",
            cause: updateProductError(pid, updatedContent),
            message: updateProductError(pid, updatedContent),
            code: EError.PRODUCTS_ERROR,
          });
          logger.error(errorUpdateProduct);
          throw new Error(errorUpdateProduct);
        }
      }
      const product = await ProductsService.updateProduct(pid, updatedContent);
      if (product) {
        res.json({
          status: "satisfactorio",
          message: "producto modificado satisfactoriamente",
          data: product,
        });
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //delete product
  static deleteProduct = async (req, res) => {
    try {
      const pid = req.params.pid;
      const product = await ProductsService.getProductById(pid);
      if (
        (req.user.role === "premium" &&
          product.owner.toString() === req.user._id.toString()) ||
        req.user.role === "admin"
      ) {
        const result = await ProductsService.deleteProduct(pid);
        if (result) {
          res.json({
            status: "satisfactorio",
            message: "producto eliminado satisfactoriamente",
          });
        }
      } else {
        res.json({
          status: "error",
          message: `${req.user.fullName} no tiene permiso para eliminar dicho producto`,
        });
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //GET MOCKING PRODUCTS
  static getMockingProducts = async (req, res) => {
    try {
      let products = [];
      for (let i = 0; i < 100; i++) {
        const newProducts = generateProduct();
        products.push(newProducts);
      }
      res.json({ status: "succes", data: products });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
}
