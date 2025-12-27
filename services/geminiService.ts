
import { GoogleGenAI, Type } from "@google/genai";
import { Player, AIInsight } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fallback to empty string for initialization, but logic should ensure key presence
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getPlayerInsight(player: Player): Promise<AIInsight> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the stock market potential for NFL player ${player.name} (${player.position}, ${player.team}). 
        Current Price: $${player.currentPrice}. 
        Recent 24h change: ${player.change24h}%.
        Stats: ${JSON.stringify(player.stats)}.
        Consider health, upcoming matchups, and seasonal trends.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              recommendation: { 
                type: Type.STRING, 
                enum: ['BUY', 'SELL', 'HOLD'] 
              },
              confidence: { type: Type.NUMBER },
              reasoning: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            },
            required: ['summary', 'recommendation', 'confidence', 'reasoning']
          }
        }
      });

      return JSON.parse(response.text || '{}') as AIInsight;
    } catch (error) {
      console.error("Gemini Error:", error);
      return {
        summary: "Unable to reach the scout room. Gemini is currently unavailable.",
        recommendation: 'HOLD',
        confidence: 0,
        reasoning: ["Network connectivity issues", "API limits exceeded"]
      };
    }
  }

  async getMarketNews(): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate 3 short, catchy 'breaking news' headlines for a fictional NFL player stock market. Make them sound like ESPN or Bloomberg sports headlines.",
      });
      // Ensure response.text is not undefined to satisfy TypeScript string requirement
      return response.text || "Market volatility expected as teams enter next week's games.";
    } catch (error) {
      return "Market volatility expected as teams enter Week 12.";
    }
  }
}

export const geminiService = new GeminiService();
