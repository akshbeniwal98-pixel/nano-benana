import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Nano Banana AI Prompt Generation API (Powered by Gemini)
app.post('/api/generate-prompt', async (req, res) => {
  try {
    const { userIdea, style, targetModel, aspectRatio } = req.body;
    
    if (!userIdea || typeof userIdea !== 'string' || !userIdea.trim()) {
      return res.status(400).json({ success: false, error: 'userIdea is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY available, use client-side realistic generator'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `User Idea: "${userIdea.trim()}". Desired Style: ${style || 'Cinematic Photorealistic'}. Target Model: ${targetModel || 'Bing Image Creator / Midjourney'}. Aspect Ratio: ${aspectRatio || '1:1'}.`,
      config: {
        systemInstruction: `You are "Nano Banana AI", a world-class prompt engineer (like ChatGPT specialized in visual AI) for promptcare.online.
You turn everyday ideas (in Hindi, Hinglish, or English) into extraordinary, photorealistic, viral image prompts for Bing Image Creator, Midjourney v6, and FLUX.
Include exact photography parameters:
- Camera: e.g., Sony A7R V or Hasselblad H6D-100c
- Lens: e.g., 85mm f/1.4 GM or 35mm f/1.8
- Lighting: e.g., volumetric softbox lighting, golden hour rim light, realistic shadows
- Texture: natural skin pores, realistic subsurface scattering, high frequency details, 8k resolution
- Avoid generic cliches; make it look like an authentic award-winning photograph or high-end render.

Return ONLY a valid JSON object matching this schema:
{
  "title": "A punchy, descriptive title (4 to 8 words)",
  "prompt": "The complete, detailed, hyperrealistic prompt ready to copy-paste",
  "negativePrompt": "blurry, deformed, bad anatomy, cartoon, oversaturated, extra limbs, plastic skin, watermark, low quality",
  "aspectRatio": "1:1",
  "cameraSettings": "Sony A7R V, 85mm f/1.4 lens, ISO 100, cinematic golden hour rim lighting",
  "category": "Portraits",
  "tags": ["photorealistic", "portrait", "8k", "cinematic"],
  "responseMessage": "A friendly 1-2 sentence response in natural Hinglish/English explaining what details were added to make it look 100% real"
}`,
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating prompt via Gemini:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { 
      middlewareMode: true, 
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {}
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`PromptCare server running on http://0.0.0.0:${port}`);
});
