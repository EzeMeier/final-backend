//AUTH

export const authError = () => {
  return `Nombre, email y contraseña son campos obligatorios`;
};
export const loginError = () => {
  return `Email y contraseña obligatorio`;
};

//PRODUCTS

///add product
export const addProductError = () => {
  return `todos los campos son obligatorios`;
};
///get product by ID
export const getProductError = (id) => {
  return `ID ${id} no encontrado`;
};
///update product
export const updateProductError = (id, updatedContent) => {
  if (!id) {
    return `ID no encontrado`;
  }
  if (updatedContent) {
    return `los campos a modificar son: titulo, descripcion, precio, codigo, stock, estado y categoria`;
  }
};
///delete product
export const deleteProductError = (id) => {
  if (!id) {
    return `ID not found`;
  }
};
