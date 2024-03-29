import { config } from "../config/config.js";
import jwt from "jsonwebtoken";
import { transporter } from "../config/gmail.js";

export const generateEmailToken = (email, expireTime) => {
  const token = jwt.sign({ email }, config.gmail.token, {
    expiresIn: expireTime,
  });
  return token;
};

export const sendChangePasswordEmail = async (req, userEmail, token) => {
  const domain = `${req.protocol}://${req.get("host")}`;
  const link = `${domain}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: "E-commerce",
    to: userEmail,
    subject: "Password reset",
    html: `<div style="text-align:center">
    <h2>Hola</h2>
    <h4>Para modificar tu contraseña ingresa al siguiente link:</h4>
    <a href="${link}" style="width: 50%; height: 50px; font-size:medium; text-decoration:none;">Reset password
    </a>
    </div>`,
  });
};

export const verifyEmailToken = (token) => {
  try {
    const data = jwt.verify(token, config.gmail.token);
    return data.email;
  } catch (error) {
    return null;
  }
};
