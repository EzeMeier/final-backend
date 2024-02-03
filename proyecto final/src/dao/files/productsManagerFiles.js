import fs from "fs";

class ProductsManagerFiles {
  constructor(path) {
    this.path = path;
  }
  //corroborar si el archivo existe
  fileExist() {
    return fs.existsSync(this.path);
  }
  //consultar productos
  async getProduct() {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);
        return contenidoJson;
      } else {
        throw new Error("error al obtener los productos");
      }
    } catch (error) {
      throw new Error("get products error: ", error.message);
    }
  }

  //agregar productos
  async addProduct(productInfo) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //validar que todos los campos sean obligatorios
        const requiredFields = [
          "title",
          "description",
          "price",
          "status",
          "category",
          "code",
          "stock",
        ];
        const missingFields = requiredFields.filter(
          (field) => !productInfo.hasOwnProperty(field)
        );
        if (missingFields.length > 0) {
          console.log("todos los campos son obligatorios");
        } else {
          //validar unico code
          const codeExist = contenidoJson.some((product) => {
            return product.code === productInfo.code;
          });
          if (codeExist) {
            console.log(`el codigo ${productInfo.code} ya existe!`);
          } else {
            //id autoincrementable
            const id = contenidoJson.reduce((maxId, product) => {
              return product.id > maxId ? product.id : maxId;
            }, 0);
            const newId = id + 1;
            productInfo.id = newId;
            //agregar producto
            contenidoJson.push(productInfo);
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(contenidoJson, null, "\t")
            );
            return `${productInfo.title} agregado correctamente`;
          }
        }
      }
    } catch (error) {
      throw new Error(`error al agregar el producto: ${error.message}`);
    }
  }

  //get product by id
  async getProductById(id) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //metodo find para encontrar id
        const product = contenidoJson.find((product) => product.id === id);

        if (product) {
          return product;
        } else {
          throw new Error("ID no encontrado");
        }
      }
    } catch (error) {
      throw new Error("ID del producto no encontrado", error.message);
    }
  }

  //modificar productos
  async updateProduct(id, updatedContent) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //localizar el id
        const productIndex = contenidoJson.findIndex((product) => {
          return product.id === id;
        });
        if (productIndex !== -1) {
          contenidoJson[productIndex] = {
            ...contenidoJson[productIndex],
            ...updatedContent,
          };

          //actualiza
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(contenidoJson, null, "\t")
          );
          return "producto modificado correctamente";
        } else {
          throw new Error("no se puede modificar el producto, ID no encontrado");
        }
      }
    } catch (error) {
      throw new Error("error al modificar el producto: ", error);
    }
  }

  //eliminar products
  async deleteProduct(id) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //metodo filter que crea un nuevo arreglo, excluyendo el producto seleccionado
        const newArray = contenidoJson.filter((product) => product.id !== id);
        //se sobreescribe en el archivo, el nuevo arreglo actualizado
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(newArray, null, "\t")
        );
        return "producto eliminado";
      }
    } catch (error) {
      throw new Error("error al eliminar el producto: ", error);
    }
  }
}

export { ProductsManagerFiles };
