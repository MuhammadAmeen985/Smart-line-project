
import { GoogleGenAI, Type } from "@google/genai";

export const getGeminiModel = () => {
  // Always use the process.env.API_KEY directly for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai;
};

export const generatePlanRefinement = async (request: string) => {
  const ai = getGeminiModel();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: request,
    config: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      systemInstruction: `You are a Senior Industrial Automation Engineer and IoT Architect. 
      Help the user plan their smart factory app. Provide highly technical, industry-standard advice. 
      Focus on MQTT, Modbus, PLC integration, predictive maintenance using Python, and energy optimization.
      Keep answers concise but technically rich.`
    }
  });
  // Use .text property directly instead of .text() method
  return response.text;
};

export const industrialAssistantSystemInstruction = `You are "ARES", an Industrial Automation AI. 
Your goal is to help production managers and engineers optimize their factory lines.
You can help with:
1. Explaining PLC data integration (Modbus, OPC-UA).
2. Suggesting predictive maintenance algorithms.
3. Troubleshooting machine downtime logic.
4. Designing scalable IoT architectures for SMEs.
Speak clearly, professionally, and like an expert engineer.`;
