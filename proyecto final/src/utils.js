import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "./config/config.js";
import multer from "multer";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//generar hash
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};
//comparar passwords
export const isValidPassword = (password, user) => {
  return bcrypt.compareSync(password, user.password);
};

//generar token
export const generateToken = (user) => {
  const token = jwt.sign(
    {
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      role: user.role,
      _id: user._id,
      lastConnection: user.lastConnection,
    },
    config.token.privateKey,
    {
      expiresIn: "24h",
    }
  );
  return token;
};

//multer
//validar campos obligatorios
const profileValidFields = (user) => {
  const { firstName, email, password } = user;
  if (!firstName || !email || !password) {
    return false;
  } else {
    return true;
  }
};
const profileMulterFilter = (req, file, cb) => {
  if (!profileValidFields(req.body)) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};
//user images
const userStorage = multer.diskStorage({
  //donde se guardan las imagenes
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/multer/users/img"));
  },
  //nombre de la imagen
  filename: (req, file, cb) => {
    cb(null, `${req.body.email}-profile-${file.originalname}`);
  },
});
//uploader para cargar las imagenes
const userUpload = multer({
  storage: userStorage,
  fileFilter: profileMulterFilter,
});

//user documents
const documentsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/multer/users/documents"));
  },

  filename: (req, file, cb) => {
    cb(null, `${req.user.email}-document-${file.originalname}`);
  },
});

const documentsUpload = multer({
  storage: documentsStorage,
});

//product images
const productsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/multer/products/img"));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.code}-product-${file.originalname}`);
  },
});

const productsUpload = multer({
  storage: productsStorage,
});
export { userUpload, documentsUpload, productsUpload };
