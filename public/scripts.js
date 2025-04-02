const chat = document.getElementById("chat");
const messageForm = document.getElementById("messageForm");
const textInput = document.getElementById("text");
const numberInput = document.getElementById("number");

// Conectar ao WebSocket
const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  console.log("Conectado ao WebSocket");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "message_received") {
    const { sender, pushName, message } = data.data;

    // Verificar se a mensagem é enviada por você
    const currentNumber = numberInput.value;
    if (sender === `${currentNumber}@s.whatsapp.net` || !pushName) {
      // Exibir mensagem enviada por você no lado direito
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", "sent");
      messageDiv.innerHTML = `<strong>Você:</strong> ${message}`;
      chat.appendChild(messageDiv);

      // Scroll automático para a última mensagem
      chat.scrollTop = chat.scrollHeight;
      return;
    }

    // Exibir mensagem recebida no lado esquerdo
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "received");
    messageDiv.innerHTML = `<strong>${pushName || sender}:</strong> ${message}`;
    chat.appendChild(messageDiv);

    // Scroll automático para a última mensagem
    chat.scrollTop = chat.scrollHeight;
  } else {
    console.log("Evento desconhecido recebido:", data);
  }
};

socket.onclose = () => {
  console.log("Desconectado do WebSocket");
};

// Enviar mensagem
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = textInput.value;
  const number = numberInput.value;

  if (!text || !number) {
    alert("Por favor, preencha o número e a mensagem.");
    return;
  }

  // Exibir mensagem enviada no chat
  //const messageDiv = document.createElement("div");
  //messageDiv.classList.add("message", "sent");
  //messageDiv.innerHTML = `<strong>Você:</strong> ${text}`;
  //chat.appendChild(messageDiv);

  // Scroll automático para a última mensagem
  chat.scrollTop = chat.scrollHeight;

  // Enviar mensagem para o servidor
  try {
    const response = await fetch("/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number, text }),
    });

    const result = await response.json();
    console.log("Mensagem enviada:", result);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }

  // Limpar o campo de texto
  textInput.value = "";
});
