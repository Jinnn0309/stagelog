import { GoogleGenAI } from "@google/genai";
import { ShowRecord } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMonthlySummary = async (
  month: string, 
  records: ShowRecord[]
): Promise<string> => {
  if (!apiKey) {
    return "Please configure your API Key to use the AI summary feature.";
  }

  if (records.length === 0) {
    return "This month was quiet! Go see some shows to get a summary.";
  }

  const showsList = records.map(r => 
    `- ${r.title} at ${r.location} on ${r.date}. Role/Cast highlights: ${r.cast.map(c => c.actor).join(', ')}`
  ).join('\n');

  const prompt = `
    I am a musical theater enthusiast. Here is a list of shows I watched in ${month}:
    ${showsList}

    Please write a short, fun, and emotional monthly summary (in Chinese) for my theater diary. 
    Focus on the joy of live performance, the variety of shows, and the money spent (worth it!).
    Keep the tone enthusiastic and suitable for a social media share.
    Do not use markdown formatting like bolding or headers, just plain text paragraphs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, the AI muse is taking a break. Please try again later.";
  }
};
