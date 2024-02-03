import mongoose from "mongoose";
import { config } from "../src/config/config.js";
import { productsModel } from "../src/dao/mongo/models/products.model.js";
import { logger } from "../src/helpers/logger.js";

await mongoose.connect(config.mongo.url);

const updateProducts = async () => {
  try {
    const adminId = "6564ea0d913aa2774e9e2ea6";
    const result = await productsModel.updateMany(
      {},
      { $set: { owner: adminId } }
    );
    console.log(result);
  } catch (error) {
    logger.error(error);
  }
};
updateProducts();
