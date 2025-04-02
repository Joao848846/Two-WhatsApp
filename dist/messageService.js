"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextMessage = sendTextMessage;
// filepath: c:\Users\jvsde\work\Two-WhatsApp\messageService.ts
const axios_1 = __importDefault(require("axios"));
const API_URL = "http://localhost:8080";
const API_KEY = "12345";
function sendTextMessage(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("Enviando mensagem com payload:", payload);
        try {
            const response = yield axios_1.default.post(`${API_URL}/message/sendText/teste`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    apikey: API_KEY,
                },
            });
            console.log("Resposta da API:", response.data); // Log para depuração
            return response.data; // Retorna a resposta da API
        }
        catch (error) {
            console.error("Erro ao enviar mensagem:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error; // Lança o erro para ser tratado no servidor
        }
    });
}
