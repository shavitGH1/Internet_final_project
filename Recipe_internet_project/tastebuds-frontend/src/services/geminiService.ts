import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.REACT_APP_GEMINI_API_KEY, // Use the API key from the environment variable
});

export const fetchRecipeFromGemini = async (contents: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
    });
    return response.text; // Adjust based on the API response structure
  } catch (error) {
    console.error("Error fetching recipe from Gemini API:", error);
    throw new Error("Failed to fetch recipe from Gemini API.");
  }
};