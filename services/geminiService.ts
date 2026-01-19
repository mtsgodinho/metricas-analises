
import { GoogleGenAI, Type } from "@google/genai";
import { MetaMetric, AnalysisResult } from "../types";

export const analyzeMetrics = async (data: MetaMetric[]): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analise as seguintes métricas de anúncios do Meta (Facebook Ads) e forneça recomendações profissionais de otimização em PORTUGUÊS do Brasil.
  Dados: ${JSON.stringify(data)}
  
  Por favor, forneça:
  1. Um resumo conciso da performance.
  2. 3-5 recomendações específicas (escala, criativo, segmentação ou redução de custo).
  3. Uma pontuação geral de otimização (0-100).
  
  IMPORTANTE: Responda obrigatoriamente em PORTUGUÊS.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          score: { type: Type.NUMBER },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "scaling, reduction, creative, or targeting" },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING, description: "high, medium, or low" },
                action: { type: Type.STRING }
              },
              required: ["type", "title", "description", "impact", "action"]
            }
          }
        },
        required: ["summary", "score", "recommendations"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Resposta vazia da IA");
  
  return JSON.parse(text) as AnalysisResult;
};
