// filepath: c:\Users\jvsde\work\Two-WhatsApp\messageService.ts
import axios from "axios";

const API_URL = "http://localhost:8080";
const API_KEY = "12345";

export interface SendMessagePayload {
  number: string;
  text: string;
}

export async function sendTextMessage(
  payload: SendMessagePayload
): Promise<any> {
  console.log("Enviando mensagem com payload:", payload);

  try {
    const response = await axios.post(
      `${API_URL}/message/sendText/teste`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          apikey: API_KEY,
        },
      }
    );
    console.log("Resposta da API:", response.data); // Log para depuração
    return response.data; // Retorna a resposta da API
  } catch (error: any) {
    console.error(
      "Erro ao enviar mensagem:",
      error.response?.data || error.message
    );
    throw error; // Lança o erro para ser tratado no servidor
  }
}
