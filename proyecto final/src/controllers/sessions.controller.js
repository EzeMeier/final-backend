import { createHash, generateToken } from "../utils.js";
import { CustomError } from "../services/errors/customError.service.js";
import {
  authError,
  loginError,
} from "../services/errors/createError.service.js";
import { EError } from "../enums/EError.js";
import { logger } from "../helpers/logger.js";
import { UsersService } from "../services/users.service.js";
import {
  generateEmailToken,
  sendChangePasswordEmail,
  verifyEmailToken,
} from "../helpers/email.js";
import { isValidPassword } from "../utils.js";

export class SessionsController {
  //sign up
  static signup = async (req, res) => {
    res.render("login", {
      message: "usuario creado satisfactoriamente",
    });
  };

  //MANEJO DE ERRORES DE AUTENTICACION, FAIL SIGNUP
  static failSignup = (req, res) => {
    const signupError = CustomError.createError({
      name: "Sign up error",
      cause: authError(),
      message: authError(),
      code: EError.AUTH_ERROR,
    });
    res.render("signup", {
      error: signupError,
    });
  };

  //log in
  static login = async (req, res) => {
    const token = generateToken(req.user);

    res
      .cookie("cookieToken", token)
      .json({
        status: "satisfactorio",
        message: "login satisfactorio",
        accessToken: token,
      })
      .render("profile");
  };

  //MANEJO DE ERRORES DE AUTENTICACION, FAIL LOGIN
  static failLogin = (req, res) => {
    const errorLogin = CustomError.createError({
      name: "Log in error",
      cause: loginError(),
      message: "email o contraseña incorrectos",
      code: EError.AUTH_ERROR,
    });

    res.render("login", { error: errorLogin});
  };

  //sign up with github
  static signupGithub = (req, res) => {
    const token = generateToken(req.user);
    res.cookie("cookieToken", token).render("profile");
  };

  //log in up with github
  static loginGithub = (req, res) => {
    const token = generateToken(req.user);
    res
      .cookie("cookieToken", token)
      .redirect("/profile", 200);
  };

  //forgot password
  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UsersService.getUserByEmail(email);
      if (!user) {
        res.render("forgotPassword", {
          error: `Usuario no registrado`,
        });
      }
      const emailToken = generateEmailToken(email, 3600);
      await sendChangePasswordEmail(req, email, emailToken);

      res.render("login", {
        message: `se envia link al mail ${email}`,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  //reset password
  static resetPassword = async (req, res) => {
    try {
      const token = req.query.token;
      const { newPassword } = req.body;
      const validEmail = verifyEmailToken(token);
      //link expired
      if (!validEmail) {
        res.render("forgotPassword", {
          error: `El link expiro`,
        });
      }
      //user not found
      const user = await UsersService.getUserByEmail(validEmail);
      if (!user) {
        res.render("resetPassword", {
          error: "Operación invalida",
        });
      }
      //repeated password
      if (isValidPassword(newPassword, user)) {
        res.render("resetPassword", {
          token,
          error: "Contraseña incorrecta",
        });
      }
      //change password
      const userData = {
        ...user,
        password: createHash(newPassword),
      };
      await UsersService.updateUser(user._id, userData);
      res.render("login", {
        message: `Contraseña modificada correctamente`,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  //profile
  static profile = async (req, res) => {
    try {
      res.json({ status: "success", message: "valid request", data: req.user });
    } catch (error) {
      logger.error(error);
    }
  };

  //fail auth
  static failAuth = (req, res) => {
    res.json({ status: "error", message: "token invalido" });
  };

  //logout
  static logout = async (req, res) => {
    try {
      const user = { ...req.user };
      user.lastConnection = new Date();
      await UsersService.updateUser(user.id, user);
      res.clearCookie("cookieToken");
      res.redirect("/login", 200);
    } catch (error) {
      res.render("profile", { error: "logout error" });
    }
  };
}
