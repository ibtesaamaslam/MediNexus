import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { GoogleGenAI } from "@google/genai";

// Initialize secure AI client on server side
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const summarizeNotes = async (req: any, res: any) => {
  const { notes } = req.body;
  
  if (!notes) {
    return res.status(400).json({ error: "Notes are required" });
  }

  // Local Fallback if API key is missing (Dev Mode)
  if (!apiKey) {
     console.warn("Gemini API Key missing. Using local fallback.");
     return res.json({ 
       summary: `[LOCAL FALLBACK SUMMARY]\n\nSubjective: Patient notes received.\nObjective: N/A\nAssessment: Automated fallback response.\nPlan: Configure API_KEY in .env to enable real AI summarization.\n\nOriginal: ${notes.substring(0, 50)}...` 
     });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert medical scribe. Convert the following raw clinical notes into a structured SOAP (Subjective, Objective, Assessment, Plan) note format. Keep it professional and concise.\n\nRaw Notes:\n${notes}`,
    });
    
    res.json({ summary: response.text });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};