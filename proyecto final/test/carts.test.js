import { app } from "../src/app.js";
import { expect } from "chai";
import supertest from "supertest";
import { usersModel } from "../src/dao/mongo/models/users.model.js";
import { cartsModel } from "../src/dao/mongo/models/carts.model.js";
import { productsModel } from "../src/dao/mongo/models/products.model.js";

const requester = supertest(app);

describe("ecommerce test", async function () {
  describe("carro router test", async function () {
    before(async function () {
      this.cookie;
      await usersModel.deleteMany({});
      await cartsModel.deleteMany({});
      await productsModel.deleteMany({});
    });

    //get all carts
    it("obtener todo los carritos con el metodo GET", async function () {
      const response = await requester.get("/api/carts");
      expect(response.status).to.be.equal(200);
      expect(Array.isArray(response.body.data)).to.be.equal(true);
    });
    //add cart
    it("agregar al carrito con el metodo POST", async function () {
      const response = await requester.post("/api/carts");
      expect(response.body.status).to.be.equal("success");
      expect(response.body.message).to.be.equal("carrito agregado correctamente");
      expect(response.body.data).to.be.an("object");
    });
    //get cart id
    it("obtener el carrito por su ID con el metodo GET", async function () {
      const response = await requester.post("/api/carts");
      const cid = response.body.data._id;
      const getById = await requester.get(`/api/carts/${cid}`);
      expect(getById.status).to.be.equal(200);
      expect(getById.body.cart._id).to.be.equal(`${cid}`);
    });
    //delete cart
    it("eliminar el carrito por el metodo DELETE", async function () {
      const response = await requester.post("/api/carts");
      const cid = response.body.data._id;
      const deleteCart = await requester.delete(`/api/carts/${cid}`);
      expect(deleteCart.body.status).to.be.equal("success");
      expect(deleteCart.body.message).to.be.equal("carrito eliminado");
    });
    //agregar productos al arreglo del carrito seleccionado
    it("agregagar productos al carrito con el metodo POST", async function () {
      const response = await requester.post("/api/carts");
      const cid = response.body.data._id;

      const userAdmin = {
        firstName: "ezequiel",
        lastName: "meier",
        age: 35,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };
      //crea un user admin
      const signup = await requester
        .post("/api/sessions/signup")
        .send(userAdmin);

      //se registra
      const login = await requester
        .post("/api/sessions/login")
        .send({ email: userAdmin.email, password: userAdmin.password });

      const cookieResult = login.header["set-cookie"][0];

      const cookieData = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      this.cookie = cookieData;
      expect(this.cookie.name).to.be.equal("cookieToken");

      //admin agrega un producto
      const productMock = {
        title: "Botines",
        description: "Botines futbol 5",
        price: 13000,
        thumbnail:
          "",
        code: "PROD2",
        stock: 2,
        status: true,
        category: "full",
      };
      const addProduct = await requester
        .post("/api/products")
        .send(productMock)
        .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
      expect(addProduct.body.message).to.be.equal(
        `${productMock.title} added successfully`
      );

      console.log(addProduct);

    });
    //eliminar product del cart
    it("eliminar el producto del carrito con el metodo DELETE ", async function () {});
    //actualizar quantity del product en el cart
    it("modificar productos del carritos con el metodo PUT", async function () {});
    //purchase
    it("finalizar la compra con el metodo POST", async function () {});
  });
});
