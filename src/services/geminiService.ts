/**
 * Gemini Service - Cloudflare Worker Proxy
 * Ahora las llamadas van a través de un Cloudflare Worker seguro
 * que mantiene la API key protegida en el servidor.
 */

import { ChatMessage } from '../types';

// URL de tu Cloudflare Worker
const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'https://leandro-portfolio-gemini-proxy.leandro-alvarez-portfolio.workers.dev';

export const sendMessageToGemini = async (
  message: string,
  history: ChatMessage[]
): Promise<string> => {
  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: history.filter(h => !h.isError) // Filtrar mensajes de error
      })
    });

    if (!response.ok) {
      throw new Error(`Worker responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success === false || data.error) {
      console.error("Worker error:", data.error);
      return data.text || "Lo siento, hubo un error de conexión con mi cerebro de IA. Por favor intenta más tarde.";
    }

    return data.text || "Lo siento, no pude generar una respuesta en este momento.";

  } catch (error: any) {
    console.error("Error communicating with Gemini Worker:", error);

    return "Lo siento, hubo un error de conexión con mi cerebro de IA. Por favor intenta más tarde.";
  }
};