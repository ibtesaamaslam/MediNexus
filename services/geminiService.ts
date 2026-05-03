import { GoogleGenAI } from "@google/genai";

// In a real app, this comes from secure env. 
// For this demo, we assume process.env.API_KEY is available via the build system/environment.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

/**
 * Summarizes a clinical note into a SOAP format.
 */
export const summarizeClinicalNote = async (noteContent: string): Promise<string> => {
  if (!apiKey) return "AI Service Unavailable (Missing API Key)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert medical scribe. Convert the following raw clinical notes into a structured SOAP (Subjective, Objective, Assessment, Plan) note format. Keep it professional and concise.\n\nRaw Notes:\n${noteContent}`,
      config: {
        temperature: 0.2,
      }
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary. Please try again.";
  }
};

/**
 * Chat assistant for receptionists to answer policy questions.
 */
export const askClinicAssistant = async (query: string, context: string): Promise<string> => {
  if (!apiKey) return "AI Service Unavailable";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful clinic assistant. Answer the following question based on the provided clinic context. If the answer isn't in the context, say you don't know.\n\nContext: ${context}\n\nQuestion: ${query}`,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the AI service right now.";
  }
};
