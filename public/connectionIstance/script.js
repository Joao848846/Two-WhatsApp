const instanceNameInput = document.getElementById("instanceName");
const numberInput = document.getElementById("number");
const createButton = document.getElementById("createButton");

const instanceDisplay = document.getElementById("instanceDisplay");
const qrcodeDisplay = document.getElementById("qrcodeDisplay");

createButton.addEventListener("click", async () => {
  const instanceName = instanceNameInput.value.trim();
  const number = numberInput.value.trim();

  if (!instanceName || !number) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/create-instance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instanceName,
        number,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS",
        webhookUrl: "http://seu-webhook-url.com",
        chain: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro na resposta da API");
    }

    const data = await response.json();

    console.log("Resposta da API:", data);

    instanceDisplay.textContent = `ID da Instância: ${
      data.instanceId || "N/A"
    }`;

    if (data.qrcode) {
      qrcodeDisplay.innerHTML = `<img src="${data.qrcode}" alt="QR Code" />`;
    } else {
      qrcodeDisplay.textContent = "QR Code não recebido.";
    }
  } catch (error) {
    console.error("Erro ao criar instância:", error);
    alert("Erro ao criar instância. Verifique o console para mais detalhes.");
  }
});
