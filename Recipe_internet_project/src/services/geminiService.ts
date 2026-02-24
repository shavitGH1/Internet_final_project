export const fetchRecipeFromGemini = async (prompt: string) => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch from server");
    }

    const data = await response.json();
    return data.text; 
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};