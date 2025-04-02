import express from "express";
import { sendTextMessage } from "./messageService";
import { WebSocketServer } from "ws";
import axios from "axios";

const app: express.Application = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static("public"));

// Criação do WebSocket Server
const wss = new WebSocketServer({ noServer: true });
const clients: import("ws").WebSocket[] = [];

// Gerenciar conexões WebSocket
wss.on("connection", (ws) => {
  console.log("Cliente conectado via WebSocket");
  clients.push(ws);

  ws.on("close", () => {
    console.log("Cliente desconectado");
    const index = clients.indexOf(ws);
    if (index !== -1) clients.splice(index, 1);
  });
});

// Endpoint para enviar mensagem
app.post("/send-message", async (req, res) => {
  const { number, text } = req.body;

  console.log("Dados recebidos no corpo da requisição:", { number, text });

  if (!number || !text) {
    console.error("Número ou texto ausente na requisição.");
    return res.status(400).json({ error: "Número e texto são obrigatórios." });
  }

  try {
    console.log("Chamando o serviço sendTextMessage para enviar a mensagem...");

    // Chama o serviço sendTextMessage
    const apiResponse = await sendTextMessage({ number, text });

    console.log("Resposta da API externa recebida com sucesso:");
    console.log(JSON.stringify(apiResponse, null, 2));

    // Retorna o resultado da API externa para o cliente
    res.json({
      message: "Mensagem enviada com sucesso!",
      data: apiResponse,
    });
  } catch (error: any) {
    console.error("Erro ao enviar mensagem para a API externa:");
    console.error("Mensagem de erro:", error.message);
    console.error("Detalhes do erro:", error.response?.data || error);

    res.status(500).json({
      error:
        error.response?.data || error.message || "Erro ao enviar mensagem.",
    });
  }
});

// Endpoint para receber eventos de mensagens via WebHook
app.post("/webhook/*", (req, res) => {
  const event = req.body;

  console.log("Evento recebido:", event);

  // Verificar se o evento contém uma mensagem
  if (event.data && event.data.message) {
    const messageData = {
      sender: event.data.sender,
      pushName: event.data.pushName,
      message: event.data.message.conversation || "Mensagem não encontrada",
      timestamp: event.data.messageTimestamp,
    };

    console.log("Mensagem processada:", messageData);

    // Enviar a mensagem processada para todos os clientes conectados via WebSocket
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(
          JSON.stringify({ type: "message_received", data: messageData })
        );
      }
    });
  } else {
    console.log("Evento recebido sem mensagem:", event);
  }

  res.status(200).send("Evento recebido com sucesso!");
});

// Middleware para capturar todas as outras requisições
app.all("*", (req, res) => {
  const event = {
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
  };

  console.log("Requisição recebida:", event);

  // Enviar o evento para todos os clientes conectados via WebSocket
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: "generic_event", data: event }));
    }
  });

  res.status(200).send("Requisição recebida com sucesso!");
});

// Integrar WebSocket ao servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
