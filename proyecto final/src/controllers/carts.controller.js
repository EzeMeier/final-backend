import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";
import { v4 as uuidv4 } from "uuid";
import { TicketsService } from "../services/tickets.service.js";
import { transporter } from "../config/gmail.js";
import { config } from "../config/config.js";

export class CartsController {
  //get carts
  static getCarts = async (req, res) => {
    try {
      const carts = await CartsService.getCarts();
      res.json({ data: carts });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //add cart
  static addCart = async (req, res) => {
    try {
      const cart = await CartsService.addCart();
      res.json({
        status: "satisfactorio",
        message: "carrito agregado satisfactoriamente",
        data: cart,
      });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //get cart id
  static getCartById = async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await CartsService.getCartById(cid);
      res.json({ data: `cart ID: ${cid}`, cart });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //delete cart
  static deleteCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      await CartsService.deleteCart(cid);
      res.json({
        status: "satisfactorio",
        message: "carrito eliminado satisfactoriamente",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //agregar productos al arreglo del carrito seleccionado
  static addProduct = async (req, res) => {
    try {
      const { cid, pid } = req.params;

      //verificar que el cart y el product existan
      await CartsService.getCartById(cid);
      await ProductsService.getProductById(pid);

      const result = await CartsService.addProduct(cid, pid);

      res.json({
        status: "satisfactorio",
        message: `producto ${pid} agregado ${cid} satisfactoriamente`,
        data: result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //eliminar product del cart
  static deleteProductCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await CartsService.getCartById(cid);
      const result = await CartsService.deleteProductCart(cid, pid);
      res.json({
        status: "satisfactorio",
        message: "producto eliminado del carrito satisfactoriamente",
        result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //actualizar quantity del product en el cart
  static updateProductCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { newQuantity } = req.body;
      await CartsService.getCartById(cid);
      const result = await CartsService.updateProductCart(
        cid,
        pid,
        newQuantity
      );
      res.json({
        data: result,
        status: "satisfactorio",
        message: "producto modificado",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //purchase
  static purchaseCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await CartsService.getCartById(cid);

      if (cart.products.length) {
        const ticketProducts = [];
        const rejectedProducts = [];

        //verificar stock de productos
        for (let i = 0; i < cart.products.length; i++) {
          const cartProducts = cart.products[i];
          const productInfo = cartProducts.productId;

          //comparar quantity con stock disponible
          if (cartProducts.quantity <= productInfo.stock) {
            ticketProducts.push(cartProducts);

            //restar stock
            const newStock = productInfo.stock - cartProducts.quantity;

            if (newStock < 0) {
              rejectedProducts.push({
                product: cartProducts,
                reason: "stock insuficiente",
              });
              continue;
            }

            //actualizar stock del carrito
            await CartsService.updateCart(cid, { stock: newStock });

            //actualizar stock de producto
            await ProductsService.updateProductStock(productInfo._id, {
              stock: newStock,
            });
          } else {
            rejectedProducts.push({
              product: cartProducts,
              reason: "stock insuficiente",
            });
            continue;
          }
        }

        //calcular amount
        let total = 0;
        ticketProducts.forEach((product) => {
          const precioCantidad = product.productId.price * product.quantity;
          total += precioCantidad;
        });

        const date = new Date();
        const localDateTime = date.toLocaleDateString();

        //datos del ticket
        const newTicket = {
          code: uuidv4(),
          purchase_datetime: localDateTime,
          amount: total,
          //hardcodeado porque no me lee req.user
          purchaser: "meierezequiel@gmail.com",
        };

        //crear ticket en DB
        const ticket = await TicketsService.addTicket(newTicket);

        //devolver datos del ticket
        const ticketId = ticket._id;
        await TicketsService.getTicketById(ticketId);

        //enviar ticket por gmail
        const template = (ticket) => `<h1>Gracias por la compra</h1>
         <h3>Detalle de compra</h3>
         <p>Codigo de compra: ${ticket.code}</p>
         <p>Fecha: ${ticket.purchase_datetime}</p>
         <p>Total: ${ticket.amount}</p>`;

        await transporter.sendMail({
          from: config.gmail.account,
          to: ticket.purchaser,
          subject: "Compra recibida",
          html: template(ticket),
        });

        if (rejectedProducts.length) {
          console.log(ticket);
          //actualizar carrito con productos rechazados
          await CartsService.updateCart(cid, {
            products: rejectedProducts,
          });

          return res.json({
            status: "satisfactorio",
            message:
              "Compra complete: los siguientes productos no figuran por falta de stock",
            rejectedProducts,
            ticket: ticket,
          });
        } else {
          return res.json({
            status: "satisfactorio",
            message: "Compra hecha!!",
            ticket: ticket,
          });
        }
      } else {
        res.json({ status: "error", message: "Este carrito se ecnuentra vacio" });
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
}
