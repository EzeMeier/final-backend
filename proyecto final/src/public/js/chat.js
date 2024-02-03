document.addEventListener("DOMContentLoaded", async () => {
  const socketClient = io();

  const username = document.getElementById("username");
  const inputMsg = document.getElementById("inputMsg");
  const sendMsg = document.getElementById("sendMsg");
  const chatPanel = document.getElementById("chatPanel");

  const response = await fetch("/api/sessions/profile", {
    headers: { "Content-type": "application/json" },
    method: "POST",
  });
  const result = await response.json();

  const user = result.data.firstName;
  socketClient.emit("authenticated", user);

  if (result.status === "success") {
    username.innerHTML = `Hi ${user}!`;
  }

  sendMsg.addEventListener("click", () => {
    const msg = inputMsg.value;
    if (msg) {
      const message = { user, message: msg };
      socketClient.emit("messageChat", message);
      inputMsg.value = "";
    } else {
      Swal.fire({
        text: "no puedes enviar un mensaje vacio",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });

  socketClient.on("chatHistory", (data) => {
    let msgElements = "";
    data.forEach((el) => {
      msgElements += `<div class="chatMsgs"><span>${el.user}</span>
    <p>${el.message}</p>
    </div>`;
    });
    chatPanel.innerHTML = msgElements;
  });

  socketClient.on("newUser", (data) => {
    console.log("newuser:", data);
    if (user) {
      Swal.fire({
        text: data,
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  });
});
