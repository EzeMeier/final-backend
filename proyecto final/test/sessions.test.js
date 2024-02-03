import { app } from "../src/app.js";
import { expect } from "chai";
import supertest from "supertest";
import { usersModel } from "../src/dao/mongo/models/users.model.js";

const requester = supertest(app);

describe("ecommerce test", function () {
  describe("sessions router test", function () {
    const mockUser = {
      firstName: "ezequiel",
      lastName: "meier",
      age: 35,
      email: "ezequiel@coder.com",
      password: "Coder246",
    };

    before(async function () {
      this.cookie;
      await usersModel.deleteMany({});
    });

    //signup
    it("/api/sessions/signup endpoint que debe registrar al usuario correctamente", async function () {
      const user = mockUser;
      const response = await requester.post("/api/sessions/signup").send(user);
      expect(response.status).to.be.equal(200);
      expect(response.res.text).to.include("user creado correctamente");
    });

    //fails signup
    it("/api/sessions/fail-signup endpoint debe dirigirte al registro", async function () {
      const response = await requester.get("/api/sessions/fail-signup");
      expect(response.res.text).to.include("Error en el registro");
    });

    //login
    it("/api/sessions/login endpoint debe loguear al usuario correctamente", async function () {
      const user = {
        email: mockUser.email,
        password: mockUser.password,
      };
      const response = await requester.post("/api/sessions/login").send(user);
      expect(response.body.message).to.be.equal("login correcto");

      const cookieResult = response.header["set-cookie"][0];
      const cookieData = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      this.cookie = cookieData;
      expect(this.cookie.name).to.be.equal("cookieToken");
    });

    //fails login
    it("/api/sessions/fail-login endpoint debe dirigiar al inicio de sesión", async function () {
      const response = await requester.get("/api/sessions/fail-login");
      expect(response.res.text).to.include("error inicio de sesión");
    });
  });
});
