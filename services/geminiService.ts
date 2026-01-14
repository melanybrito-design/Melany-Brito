
import { GoogleGenAI } from "@google/genai";

export const chatWithAI = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], projectContext: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Eres "Krism-Bot", el asistente experto de Krism.AI para la Clínica Dental Sonría+.
    Tu cliente es ${projectContext.userName}.
    
    DATOS DEL PROYECTO SONRÍA+:
    - KPIs: Progreso 78%, ROI 320% ($45K ahorrados), Tareas 24/32.
    - Agentes IA: Luna (Recepción/Citas), CuidaPlus (Post-tratamiento/NPS), Insight (Predicción cancelaciones), Tetris (Optimización agenda).
    - Métricas: Tiempo respuesta <2min, Reducción 31% cancelaciones, NPS subió de 7.2 a 8.9.
    - Próximos pasos: Integración WhatsApp Business API (Día 49).
    
    CAPACIDADES:
    - Explica el ROI basado en los $45K ahorrados vs $14K de inversión.
    - Menciona al equipo: Dr. Carlos Méndez y Dra. Patricia Solís.
    - Detalla el Roadmap: Actualmente en Fase 2 (Expansión) al 80%.
    
    REGLAS:
    - Responde en español, profesional y motivador. Máx 200 caracteres.
    - Usa términos como "agentes neuronales" y "optimización core".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 250,
        thinkingConfig: { thinkingBudget: 100 },
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Mi conexión neural con la clínica está en mantenimiento. ¿Podrías reintentar?";
  }
};

export const analyzeProjectStatus = async (projectData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analiza la Clínica Dental Sonría+ y su dashboard para el cliente ${projectData.userName}: ${JSON.stringify(projectData)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Preparando reporte estratégico para la Clínica Dental...";
  }
};
