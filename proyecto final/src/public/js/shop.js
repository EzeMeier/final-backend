const addToCart = async (pid) => {
  try {
    const cid = "656915f9d275608fc814127f";
    if (!cid) {
      console.log("carrito no encontrado");
    }
    const response = await fetch(
      `http://localhost:8080/api/carts/${cid}/products/${pid}`,
      {
        method: "POST",
      }
    );

    if (
      response.url ===
      "http://localhost:8080/profile?error=access_denied&message=Access%20denied%20for%20admin"
    ) {
      Swal.fire({
        color: "#ff4f4f",
        align: "center",
        text: "Acceso denegado por el administrador",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      Swal.fire({
        color: "#02d12f",
        text: "producto agregado al carrito",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  } catch (error) {
    console.log("error al agregar el producto al carrito: ", error);
  }
};
