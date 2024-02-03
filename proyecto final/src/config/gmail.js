import { config } from "./config.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmail.account,
    pass: config.gmail.password,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});
