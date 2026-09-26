/**
 * Nano Banana Realistic AI Photo Prompt Engine
 * Transforms simple user ideas into world-class photorealistic prompts for Midjourney v6, Bing Image Creator & FLUX.
 * Supports simultaneous multi-variation generation (V1, V2, V3, V4).
 */

export interface PromptVariation {
  id: string;
  label: string; // e.g. "V1 (Golden Hour)", "V2 (Volumetric Rim)"
  imageUrl: string;
  styleTweak: string;
}

export interface GeneratedPromptResult {
  title: string;
  prompt: string;
  negativePrompt: string;
  aspectRatio: '1:1' | '9:16' | '16:9' | '3:4';
  cameraSettings: string;
  category: string;
  tags: string[];
  responseMessage: string;
  previewImageUrl: string;
  variations: PromptVariation[];
}

// Curated high-resolution photo previews matching prompt themes
const THEMED_PREVIEWS: Record<string, Array<{ url: string; label: string; tweak: string }>> = {
  wings: [
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', label: 'V1 (Cyan Electric Wings)', tweak: 'Volumetric cyan smoke & dark obsidian raytracing' },
    { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', label: 'V2 (Golden Angelic Embers)', tweak: 'Warm golden particle embers & dramatic rim backlight' },
    { url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80', label: 'V3 (Dark Fantasy Obsidian)', tweak: 'Deep shadow contrast & sharp 3D metallic armor highlights' },
    { url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80', label: 'V4 (Vibrant Violet Aura)', tweak: 'Neon magenta and violet particle aura in 8k render' },
  ],
  portrait: [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', label: 'V1 (35mm Natural Daylight)', tweak: 'Kodak Portra 400 soft window sidelight, subtle freckles' },
    { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', label: 'V2 (Moody Dramatic Rim)', tweak: 'Chiaroscuro studio rim light with deep cinematic shadows' },
    { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', label: 'V3 (Y2K Retro Direct Flash)', tweak: 'Direct flash aesthetic, authentic analog grain & hard wall drop shadow' },
    { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', label: 'V4 (Golden Hour Bokeh)', tweak: 'Warm backlight flare with creamy 85mm f/1.4 lens bokeh' },
  ],
  cyberpunk: [
    { url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80', label: 'V1 (Neon Monsoon Rain)', tweak: 'Wet asphalt puddle reflections & holographic cyan mist' },
    { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', label: 'V2 (High-Tech Visor)', tweak: 'Transparent futuristic trench coat & glowing visor UI' },
    { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', label: 'V3 (Cyber Rooftop Skyline)', tweak: 'Distant megacity neon billboards & cold atmospheric haze' },
    { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', label: 'V4 (Anime Cyber Glow)', tweak: 'Vibrant Makoto Shinkai cyber aesthetic with glowing particles' },
  ],
  traditional: [
    { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', label: 'V1 (Royal Courtyard Sunset)', tweak: 'Golden hour warmth on Rajasthani carved sandstone arches' },
    { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', label: 'V2 (Polki Jewelry Macro)', tweak: 'Crisp diamond luster & authentic antique gold zari weave' },
    { url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80', label: 'V3 (Jharokha Silhouette)', tweak: 'Soft diffuse palace window lighting with authentic silk sheen' },
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', label: 'V4 (Vogue India Editorial)', tweak: 'High-fashion editorial clean studio backdrop with traditional drape' },
  ],
  bike: [
    { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', label: 'V1 (Rain-Slicked City Street)', tweak: 'Wet asphalt street reflections & vintage matte-black motorcycle' },
    { url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', label: 'V2 (Golden Highway Cruiser)', tweak: 'Sunburst flare on chrome exhaust & open desert highway' },
    { url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80', label: 'V3 (Industrial Garage Workshop)', tweak: 'Warm hanging tungsten bulb lighting & authentic leather patina' },
    { url: 'https://images.unsplash.com/photo-1547025603-ef9367123d24?auto=format&fit=crop&w=800&q=80', label: 'V4 (Cyber Neon Biker)', tweak: 'Neon underglow illumination & sleek dark helmet visor reflections' },
  ],
  general: [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', label: 'V1 (Natural Studio)', tweak: 'Clean 85mm f/1.4 aperture with smooth background falloff' },
    { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', label: 'V2 (Dramatic Contour)', tweak: 'Dual studio lighting setup with sharp facial structure contouring' },
    { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', label: 'V3 (Analog 35mm Grain)', tweak: 'Kodak Tri-X / Portra authentic grain with rich shadow detail' },
    { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', label: 'V4 (Golden Hour Glow)', tweak: 'Natural outdoor sunburst flare and radiant skin warmth' },
  ]
};

function buildVariations(themeKey: string): PromptVariation[] {
  const items = THEMED_PREVIEWS[themeKey] || THEMED_PREVIEWS.general;
  return items.map((item, idx) => ({
    id: `var-${idx + 1}`,
    label: item.label,
    imageUrl: item.url,
    styleTweak: item.tweak,
  }));
}

export function generateRealisticPromptLocally(userIdea: string, targetStyle?: string): GeneratedPromptResult {
  const idea = userIdea.trim();
  const lower = idea.toLowerCase();

  // Detect custom name if provided (e.g. name "Aksh", or "Aksh")
  const nameMatch = idea.match(/name\s*["':]?\s*([a-zA-Z0-9_-]+)/i) || idea.match(/["']([a-zA-Z0-9_-]+)["']/);
  const detectedName = nameMatch ? nameMatch[1].toUpperCase() : 'AKSH';

  // 1. 3D Neon Wings / Throne trend
  if (lower.includes('wing') || lower.includes('throne') || lower.includes('3d neon') || lower.includes('pankh')) {
    const vars = buildVariations('wings');
    return {
      title: `3D Angel Wings Portrait with "${detectedName}"`,
      category: 'Viral Bing',
      aspectRatio: '1:1',
      cameraSettings: 'Digital Cinema 3D Render, Octane Render 8k, volumetric rim lights',
      tags: ['Viral Bing', '3D Neon Wings', 'Trending', 'Octane Render'],
      responseMessage: `Aapke idea ke according maine 4 simultaneous variations banaye hain! Har variation mein alag lighting aur wings aura hai. Aap apna favorite select kar sakte hain!`,
      previewImageUrl: vars[0].imageUrl,
      variations: vars,
      negativePrompt: 'blurry, bad anatomy, distorted wings, low resolution, flat colors, deformed hands, extra fingers, cartoon, 2D illustration',
      prompt: `Hyperrealistic 3D digital portrait of a stylish confident young Indian man in modern streetwear, sitting relaxedly on an ornate dark obsidian throne. Behind him are magnificent glowing cyan and golden feathered wings emitting soft atmospheric particle embers. On the dark textured wall behind, the name "${detectedName}" is written in sleek 3D neon glow typography. Volumetric rim lighting, hyper-detailed skin texture, realistic denim and leather fabric weave, dramatic depth of field, 8k resolution, rendered in Unreal Engine 5 with raytracing --ar 1:1 --v 6.0`
    };
  }

  // 2. Bike / Motorcycle / Automotive
  if (lower.includes('bike') || lower.includes('bullet') || lower.includes('car') || lower.includes('rider')) {
    const vars = buildVariations('bike');
    return {
      title: `Cinematic Royal Enfield Night Rider with "${detectedName}"`,
      category: 'Portraits',
      aspectRatio: '16:9',
      cameraSettings: 'Sony A7R V, 50mm f/1.2 GM lens, 1/200s, ISO 400, wet asphalt street reflections',
      tags: ['Cinematic', 'Biker', 'Night Photography', '35mm'],
      responseMessage: `Maine bike rider portrait ke 4 alag variations render kiye hain—rain reflections, sunset highway, workshop aur neon street. Apna favorite choose karein!`,
      previewImageUrl: vars[0].imageUrl,
      variations: vars,
      negativePrompt: 'blurry, bad anatomy, deformed motorcycle, extra wheels, cartoon, plastic skin, oversaturated, lowres',
      prompt: `Cinematic night photography of a rugged stylish 24-year-old man seated on a custom vintage matte-black Royal Enfield motorcycle on a rain-slicked city avenue. He wears a distressed leather biker jacket with "${detectedName}" subtly embossed in white thread on the chest. Neon street signage reflected on the wet asphalt, soft golden streetlight backlighting outlining his silhouette, natural skin pores, realistic beard stubble, shot on Sony A7R V, 50mm f/1.2 GM lens, shallow depth of field, 8k resolution, masterwork photography --ar 16:9 --v 6.0`
    };
  }

  // 3. Cyberpunk / Neon Monsoon
  if (lower.includes('cyber') || lower.includes('neon') || lower.includes('rain') || lower.includes('tokyo') || lower.includes('mumbai')) {
    const vars = buildVariations('cyberpunk');
    return {
      title: `Cyberpunk Neon Monsoon Portrait`,
      category: 'Cyberpunk',
      aspectRatio: '9:16',
      cameraSettings: 'Hasselblad X2D 100C, 80mm f/1.9 lens, neon volumetric haze, wet skin reflections',
      tags: ['Cyberpunk', 'Neon Rain', 'Editorial', 'Hasselblad'],
      responseMessage: `Cyberpunk theme ke 4 alag futuristic visual angles generate ho gaye hain. Transparent raincoat, visor reflections aur rainy night styles available hain!`,
      previewImageUrl: vars[0].imageUrl,
      variations: vars,
      negativePrompt: 'blurry, low quality, oversaturated anime, deformed limbs, plastic skin, 3d render doll, bad fingers',
      prompt: `Ultra-detailed cinematic portrait of a cyber-operative in a heavy monsoon rain in a futuristic cyberpunk alley. Neon cyan and magenta holographic signs reflect off a transparent high-tech waterproof trench coat and wet facial skin. Raindrops cascading down, visible skin micro-texture and detailed eye reflections, shot on Hasselblad X2D 100C with 80mm f/1.9 lens, dramatic color grading, 8k resolution, Kodak Vision3 500T 35mm film grain --ar 9:16 --v 6.0`
    };
  }

  // 4. Traditional / Royal Indian Wedding
  if (lower.includes('wedding') || lower.includes('bride') || lower.includes('royal') || lower.includes('saree') || lower.includes('traditional') || lower.includes('rajput')) {
    const vars = buildVariations('traditional');
    return {
      title: `Royal Heritage Traditional Portrait`,
      category: 'Portraits',
      aspectRatio: '3:4',
      cameraSettings: 'Canon EOS R5, 85mm f/1.4L lens, warm courtyard ambient lighting, soft golden reflector',
      tags: ['Royal Heritage', 'Traditional', 'Indian Wedding', 'Vogue India'],
      responseMessage: `Royal traditional styling ke 4 unique variations ready hain—sunset courtyard, Polki macro, jharokha silhouette aur Vogue studio!`,
      previewImageUrl: vars[0].imageUrl,
      variations: vars,
      negativePrompt: 'blurry, western clothing, cartoonish, low resolution, bad hands, fake jewelry, plastic face',
      prompt: `Award-winning portrait of an elegant royal Indian woman adorned in an authentic crimson raw silk lehenga with intricate handcrafted antique gold zardozi embroidery. Wearing traditional Polki diamond and emerald necklace and delicate mathapatti. Setting is the sunlit carved sandstone jharokha of a Rajasthani heritage palace during golden hour. Soft natural light, skin texture with authentic warmth, shot on Canon EOS R5, 85mm f/1.4 lens, Vogue India editorial aesthetic, 8k photorealistic --ar 3:4 --v 6.0`
    };
  }

  // 5. Default: Ultra-Realistic 35mm Studio Portrait
  const vars = buildVariations('portrait');
  return {
    title: `Photorealistic 35mm Film Portrait: ${idea.slice(0, 32)}...`,
    category: 'Portraits',
    aspectRatio: '1:1',
    cameraSettings: 'Sony A7 IV, 85mm f/1.4 G-Master, natural window lighting, 1/250s, ISO 100',
    tags: ['Photorealistic', '35mm Film', 'Natural Lighting', '8k'],
    responseMessage: `Aapke idea "${idea}" par 4 simultaneous photo variations generate kar di gayi hain. Apna manpasand favorite card select karein!`,
    previewImageUrl: vars[0].imageUrl,
    variations: vars,
    negativePrompt: 'blurry, artificial, airbrushed skin, CGI, 3D model, bad anatomy, extra fingers, cartoon, oversaturated, deformed eyes',
    prompt: `An award-winning ultra-photorealistic portrait of ${idea}, with natural human skin micro-texture, subtle freckles and authentic skin pores, delicate catchlight in the eyes, soft directional afternoon window sunlight illuminating one side of the face with gentle feathering shadows, shot on Sony A7 IV with 85mm f/1.4 G-Master lens, shallow depth of field, authentic 35mm Kodak Portra 400 film tones, highly detailed, 8k resolution, raw photo aesthetic --ar 1:1 --v 6.0 --style raw`
  };
}

export async function fetchAIPrompt(userIdea: string, targetStyle?: string): Promise<GeneratedPromptResult> {
  const fallback = generateRealisticPromptLocally(userIdea, targetStyle);

  try {
    const res = await fetch('/api/generate-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIdea, style: targetStyle, targetModel: 'Midjourney v6 & Bing Image Creator' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.prompt) {
        const item = data.data;
        return {
          title: item.title || fallback.title,
          prompt: item.prompt,
          negativePrompt: item.negativePrompt || fallback.negativePrompt,
          aspectRatio: item.aspectRatio || fallback.aspectRatio,
          cameraSettings: item.cameraSettings || fallback.cameraSettings,
          category: item.category || fallback.category,
          tags: item.tags || fallback.tags,
          responseMessage: item.responseMessage || `Aapke idea par 4 simultaneous variations banaye gaye hain!`,
          previewImageUrl: fallback.previewImageUrl,
          variations: fallback.variations,
        };
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable, using local generator:', err);
  }

  return fallback;
}
