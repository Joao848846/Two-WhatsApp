const chat = document.getElementById("chat");
const messageForm = document.getElementById("messageForm");
const textInput = document.getElementById("text");
const numberInput = document.getElementById("number");
const contactName = document.getElementById("contactName");
const contactNumber = document.getElementById("contactNumber");
let yourNumber = "";

// Conectar ao WebSocket
const socket = new WebSocket("ws://localhost:3000");

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "message_received") {
    const { sender, pushName, message, remoteJid, messageTimestamp } =
      data.data;
    const formattedNumber = remoteJid
      ? remoteJid.split("@")[0]
      : "Número desconhecido";

    // Atualizar o nome e o número do contato
    contactName.textContent = pushName || "Contato";
    contactNumber.textContent = formattedNumber;

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

    // Aqui, você já tem o messageTimestamp
    const timestamp = messageTimestamp ? messageTimestamp * 1000 : Date.now(); // Se não tiver, usa agora
    const date = new Date(timestamp);

    // Pega só a hora formatada tipo "14:23"
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Aí na hora que você monta a bolha de mensagem, adiciona o horário:
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "received");
    messageDiv.innerHTML = `
  <div class="message-content">
    <strong>${pushName || formattedNumber}:</strong>
    <p>${message}</p>
    <span class="message-time">${formattedTime}</span>
  </div>
`;

    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
  }
};

socket.onclose = () => {
  console.log("❌ Desconectado do WebSocket");
};

// Enviar mensagem
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = textInput.value;
  const number = numberInput.value;

  yourNumber = numberInput.value;

  if (!text || !number) {
    alert("Por favor, preencha o número e a mensagem.");
    return;
  }

  // Atualizar o número do contato no cabeçalho
  contactNumber.textContent = number;

  // Enviar mensagem para o servidor — ROTA FUNCIONAL
  try {
    const response = await fetch("http://localhost:3000/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number, text }),
    });

    const result = await response.json();
    console.log("Mensagem enviada com sucesso:", result);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }

  // Limpar o campo de texto
  textInput.value = "";
});

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  const body = document.body;

  // Verifica se já tinha modo escuro salvo
  if (localStorage.getItem("dark-mode") === "true") {
    body.classList.add("dark");
    toggle.textContent = "☀️ Modo Claro";
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDark = body.classList.contains("dark");
    localStorage.setItem("dark-mode", isDark);
    toggle.textContent = isDark ? "☀️ Modo Claro" : "🌙 Modo Escuro";
  });
});
document.body.classList.add("dark");
