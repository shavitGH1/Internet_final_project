import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("REACT_APP_GEMINI_API_KEY is not set.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const fetchRecipeFromGemini = async (contents: string) => {
  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching recipe from Gemini API:", error);
    throw new Error("Failed to fetch recipe from Gemini API.");
  }
};