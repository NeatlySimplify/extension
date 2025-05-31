require('dotenv').config();
import { GoogleGenAI, createUserContent, createPartFromUri, } from "@google/genai";

const GEMINI_API_KEY = process.env['GEMINI-API'];
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function sendToGeminiPro(textContent) {
    const chat = {
        task: "Baseado na analise do texto, crie uma lista com passo a passo para o sucesso do objetivo. Se não tiver contexto o suficiente para formular uma resposta, retorne error em status.",
        rules: "A resposta é no formato json, usa as chaves status e response, os valores para status são success e error",
        content: textContent,
    }
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20",
        contents: chat,

    })
    return response.text
}

export async function sendToGeminiFlash(objetive, text) {
    const chat = {
        task: "Baseado no objetivo, analize a página e encontre o ID do elemento requisitado para foco.",
        rules: "A resposta é no formato json, usa as chaves status e response, os valores para status são success e error",
        objetive: objetive,
        content: text,
    }
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite-001",
        contents: chat,
    })
    return response.text
}

export async function sendAudioToGemini(path) {
    const myfile = await ai.files.upload({
        file: path,
        config: { mimeType: "audio/webm" },
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "Transcribe this audio to Portuguese - BR",
        ]),
    });
    return(response.text)
}