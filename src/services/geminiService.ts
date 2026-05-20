import { GoogleGenAI } from "@google/genai";

// Robust environment variable resolution for Vite and Node
const apiKey = (
  (import.meta.env?.VITE_GEMINI_API_KEY) || 
  (import.meta.env?.VITE_API_KEY) || 
  (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY || process.env?.API_KEY : '')
) || '';

const ai = new GoogleGenAI({ apiKey });

export const getAnswerExplanation = async (
  story: string,
  question: string,
  incorrectAnswer: string
): Promise<string> => {
    const prompt = `Basado en el siguiente texto de un cuento para niños, explica de forma muy sencilla y corta por qué la respuesta "${incorrectAnswer}" a la pregunta "${question}" es incorrecta. La explicación debe ser fácil de entender para un niño y no debe superar las 2 frases.

  Texto de referencia:
  ---
  ${story}
  ---
  
  Pregunta: ${question}
  Respuesta incorrecta del alumno: ${incorrectAnswer}
  
  Explicación:`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "No se pudo generar una explicación en este momento. ¡Sigue intentándolo!";
    }
    catch (error) {
        console.error("Error generating explanation:", error);
        return "No se pudo generar una explicación en este momento. ¡Sigue intentándolo!";
    }
};

