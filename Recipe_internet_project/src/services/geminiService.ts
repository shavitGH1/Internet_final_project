import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ 
apiKey: import.meta.env.VITE_GEMINI_API_KEY || ""});

export const fetchRecipeFromGemini = async (prompt: string) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    return response.text; 
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};