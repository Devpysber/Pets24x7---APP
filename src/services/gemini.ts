import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateLogo = async (appName: string) => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found. Using fallback logo.');
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A professional and modern logo for a pet care application named '${appName}'. The logo should feature a friendly pet icon (like a dog or cat) combined with a clock or 24/7 symbol to represent round-the-clock care. Use a clean, vibrant color palette like indigo and emerald. Vector style, minimalist, white background.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error: any) {
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429) {
      console.warn('Gemini API quota exceeded for logo generation. Using fallback.');
    } else {
      console.error('Error generating logo:', error);
    }
  }
  return null;
};
