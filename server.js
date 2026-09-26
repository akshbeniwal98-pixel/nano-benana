import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Dynamic port handling: Render injects process.env.PORT (e.g. 10000), local/dev defaults to 3000
const PORT = process.env.PORT || 3000;

// Security & Parsing Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend assets from ./public
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck route for Render uptime monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'promptcare-online',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/generate-image
 * Accepts: { prompt, size, style, modelProvider }
 * - Uses OpenAI DALL-E 3 if OPENAI_API_KEY is present
 * - Uses Pollinations.ai (Flux Engine) free tier fallback if no key is provided
 * Returns: { success: true, imageUrl, revisedPrompt, provider }
 */
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, size = '1:1', style = 'cinematic', modelProvider = 'auto' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt description is required.' });
    }

    const cleanPrompt = prompt.trim();

    // Map aspect ratios to pixel dimensions
    let width = 1024;
    let height = 1024;
    let openAiSize = '1024x1024';

    if (size === '9:16') {
      width = 768;
      height = 1344;
      openAiSize = '1024x1792'; // DALL-E 3 vertical standard
    } else if (size === '16:9') {
      width = 1344;
      height = 768;
      openAiSize = '1792x1024'; // DALL-E 3 widescreen standard
    }

    // Curated photography and artistic modifiers
    const styleModifiers = {
      cinematic: 'cinematic lighting, 35mm photograph, natural optical bokeh, 8k resolution, photorealistic, masterwork composition',
      hyperrealism: 'ultra-realistic RAW portrait, visible skin pores, natural skin texture, shot on Sony A7R V, 85mm f/1.4 lens, 8k',
      '3d-neon': 'hyperrealistic 3D character render on dark obsidian throne, glowing neon wings, volumetric smoke, raytracing Unreal Engine 5, 8k',
      vintage: 'authentic 90s vintage Polaroid photo, warm Kodak Portra 400 analog film grain, nostalgic sidelight, realistic flare',
      anime: 'Makoto Shinkai aesthetic anime artwork, emotive twilight golden hour, floating glowing particles, painterly clouds, masterpiece',
      studio: 'high-end studio beauty editorial, butterfly softbox lighting, crisp sharpness on eyes, magazine cover quality'
    };

    const styleSnippet = styleModifiers[style] || styleModifiers.cinematic;
    const enhancedPrompt = `${cleanPrompt}, ${styleSnippet}`;

    // 1. Production OpenAI DALL-E 3 Generation (if OPENAI_API_KEY is present)
    if (process.env.OPENAI_API_KEY && modelProvider !== 'pollinations') {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          n: 1,
          size: openAiSize,
          quality: 'standard',
        });

        const generatedUrl = response.data[0].url;
        const revised = response.data[0].revised_prompt || enhancedPrompt;

        return res.json({
          success: true,
          imageUrl: generatedUrl,
          revisedPrompt: revised,
          provider: 'OpenAI DALL-E 3'
        });
      } catch (openAiError) {
        console.warn('OpenAI API call failed, falling back to Pollinations Flux:', openAiError.message);
        // Seamlessly falls through to Pollinations Flux fallback
      }
    }

    // 2. High-Quality Free Fallback (Pollinations.ai Flux Engine)
    // Instant, zero key required, reliable for deployment on Render free tier!
    const seed = Math.floor(Math.random() * 9999999);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;

    return res.json({
      success: true,
      imageUrl: pollinationsUrl,
      revisedPrompt: enhancedPrompt,
      provider: 'Pollinations Flux (Free Tier)'
    });
  } catch (error) {
    console.error('Server generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error generating image' 
    });
  }
});

// Single Page Application static fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 PromptCare.online Server Active on Port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🎨 In-App AI Studio: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
