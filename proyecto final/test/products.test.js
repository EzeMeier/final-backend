import { app } from "../src/app.js";
import { expect } from "chai";
import supertest from "supertest";
import { usersModel } from "../src/dao/mongo/models/users.model.js";
import { productsModel } from "../src/dao/mongo/models/products.model.js";

const requester = supertest(app);

describe("ecommerce test", async function () {
  describe("products router test", async function () {
    //product mock
    const productMock = {
      title: "Zapatillas",
      description: "Zapatilla deportiva ",
      price: 15500,
      thumbnail:
        "",
      code: "PROD1",
      stock: 1,
      status: true,
      category: "top",
    };

    beforeEach(async function () {
      this.cookie;
      await usersModel.deleteMany({});
      await productsModel.deleteMany({});
    });

    //add products
    it("agregar productos al carrito con el metodo post", async function () {
      const mockUser = {
        firstName: "ezequiel",
        lastName: "meier",
        age: 35,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };
      //crea un user admin
      const signup = await requester
        .post("/api/sessions/signup")
        .send(mockUser);

      //se registra
      const login = await requester
        .post("/api/sessions/login")
        .send({ email: mockUser.email, password: mockUser.password });

      const cookieResult = login.header["set-cookie"][0];

      const cookieData = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      this.cookie = cookieData;
      expect(this.cookie.name).to.be.equal("cookieToken");
      //admin agrega un producto
      const response = await requester
        .post("/api/products")
        .send(productMock)
        .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
      expect(response.body.message).to.be.equal(
        `${productMock.title} agregado correctamente`
      );
    });

    //get products
    it("obtener todos los productos con el metodo GET []", async function () {
      const response = await requester.get("/api/products");
      expect(response.body).to.have.property("status");
      expect(response.body).to.have.property("data");
      expect(Array.isArray(response.body.data)).to.be.equal(true);
    });

    //get product by ID
    it("obtener el producto por su ID con el metodo GET", async function () {
      const mockUser = {
        firstName: "ezequiel",
        lastName: "meier",
        age: 35,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };
      //crea un user admin
      const signup = await requester
        .post("/api/sessions/signup")
        .send(mockUser);

      //se registra
      const login = await requester
        .post("/api/sessions/login")
        .send({ email: mockUser.email, password: mockUser.password });

      const cookieResult = login.header["set-cookie"][0];

      const cookieData = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      this.cookie = cookieData;
      expect(this.cookie.name).to.be.equal("cookieToken");
      //admin agrega un producto
      const response = await requester
        .post("/api/products")
        .send(productMock)
        .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
      expect(response.body.message).to.be.equal(
        `${productMock.title} agregado correctamente`
      );
      const getProducts = await requester.get("/api/products");
      const pid = getProducts.body.data[0]._id;
      const getById = await requester.get(`/api/products/${pid}`);

      expect(getById.body.status).to.be.equal("success");
      expect(getById.body).to.have.property("data");
      expect(getById.body.data._id).to.be.equal(`${pid}`);
      expect(getById.body.data).to.be.an("object");
    });

    //update product
    it("modificar el producto con el metodo PUT", async function () {
      const mockUser = {
        firstName: "ezequiel",
        lastName: "meier",
        age: 35,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };
      //crea un user admin
      const signup = await requester
        .post("/api/sessions/signup")
        .send(mockUser);

      //se registra
      const login = await requester
        .post("/api/sessions/login")
        .send({ email: mockUser.email, password: mockUser.password });

      const cookieResult = login.header["set-cookie"][0];

      const cookieData = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      this.cookie = cookieData;
      expect(this.cookie.name).to.be.equal("cookieToken");
      //admin agrega un producto
      const response = await requester
        .post("/api/products")
        .send(productMock)
        .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
      expect(response.body.message).to.be.equal(
        `${productMock.title} agregado correctamente`
      );

      const pid = response.body.data._id;
      productMock.price = 11111111;

      const update = await requester
        .put(`/api/products/${pid}`)
        .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`])
        .send(productMock);
      expect(update.body.status).to.be.equal("success");
      expect(update.body.message).to.be.equal("producto modificado correctamente");
      expect(update.body.data).to.be.an("object");
    });

    //delete product
    it("producto eliminado con el metodo DELETE", async function () {
      const mockUser = {
        firstName: "ezequiel",
        lastName: "meier",
        age: 35,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };
      //crea un user admin
      const signup = await requester
        .post("/api/sessions/signup")
        .send(mockUser);

      //se registra
      const login = await requester
        .post("/api/sessions/login")
        .send({ email: mockUser.email, password: mockUser.password });

      const cookieResult = login.header["set-cookie"][0];

      const cookieData = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      this.cookie = cookieData;
      expect(this.cookie.name).to.be.equal("cookieToken");
      //admin agrega un producto
      const response = await requester
        .post("/api/products")
        .send(productMock)
        .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
      expect(response.body.message).to.be.equal(
        `${productMock.title} agregado correctamente`
      );
      const pid = response.body.data._id;
      const deleteProduct = await requester
        .delete(`/api/products/${pid}`)
        .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
      expect(deleteProduct.body.status).to.be.equal("success");
      expect(deleteProduct.body.message).to.be.equal(
        "producto eliminado correctamente"
      );
    });
  });
});
