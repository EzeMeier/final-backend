import { EError } from "../enums/EError.js";

export const errorHandler = (error, req, res, next) => {
  switch (error.code) {
    case EError.DATABASE_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case EError.AUTH_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case EError.JSON_BODY_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case EError.GMAIL_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case EError.CARTS_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case EError.CHAT_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
    case EError.PRODUCTS_ERROR:
      res.json({ status: "error", error: error.cause, message: error.message });
      break;
  }
};
