/**
 * Cloudflare Worker - Gemini API Proxy
 * Este worker actúa como intermediario seguro entre tu frontend y Gemini API
 */

export default {
    async fetch(request, env) {
        // Configurar CORS para permitir llamadas desde tu dominio
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*', // En producción, cambia esto a 'https://leandroalvarez.com.ar'
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Manejar preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Solo aceptar POST requests
        if (request.method !== 'POST') {
            return new Response('Method not allowed', {
                status: 405,
                headers: corsHeaders
            });
        }

        try {
            // Obtener el body del request
            const { message, history } = await request.json();

            if (!message) {
                return new Response(JSON.stringify({ error: 'Message is required' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Construir el historial para Gemini
            const contents = [
                ...(history || []).map(h => ({
                    role: h.role === 'model' ? 'model' : 'user',
                    parts: [{ text: h.text }]
                })),
                {
                    role: 'user',
                    parts: [{ text: message }]
                }
            ];

            // Llamar a Gemini API
            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: contents,
                        systemInstruction: {
                            parts: [{
                                text: env.SYSTEM_INSTRUCTION || `Eres el asistente virtual de Leandro Alvarez, un especialista en IA y automatización. 
Respondes de manera profesional, amigable y concisa sobre su experiencia, proyectos y habilidades.
Conoces sus proyectos principales:
- Sistemas de automatización con IA
- Chatbots inteligentes
- Procesamiento de facturas con OCR
- Soluciones de machine learning

Cuando te pregunten por contacto, menciona que pueden usar el botón de WhatsApp o el formulario de contacto en la página.`
                            }]
                        },
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024,
                        }
                    })
                }
            );

            if (!geminiResponse.ok) {
                const errorText = await geminiResponse.text();
                console.error('Gemini API Error:', errorText);
                throw new Error(`Gemini API error: ${geminiResponse.status}`);
            }

            const geminiData = await geminiResponse.json();

            // Extraer el texto de la respuesta
            const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
                || "Lo siento, no pude generar una respuesta en este momento.";

            return new Response(JSON.stringify({
                text: responseText,
                success: true
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Worker Error:', error);

            return new Response(JSON.stringify({
                error: 'Error al procesar la solicitud',
                text: 'Lo siento, hubo un error de conexión con mi cerebro de IA. Por favor intenta más tarde.',
                success: false
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};
