export interface CreatorInfo {
  name: string;
  handle: string;
  avatar: string;
  badge?: string;
  points?: number;
  rank?: number;
  isFollowing?: boolean;
}

export interface PromptVariable {
  key: string;
  label: string;
  defaultValue: string;
  description: string;
}

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  category: string;
  model: 'Nano Banana' | 'Midjourney v6' | 'Bing Image Creator' | 'FLUX.1' | 'Stable Diffusion XL' | string;
  promptTemplate: string;
  imageUrl: string;
  aspectRatio: '1:1' | '9:16' | '16:9' | '3:4';
  negativePrompt?: string;
  variables?: PromptVariable[];
  instructions?: string;
  author?: string;
  tags: string[];
  likes: number;
  copies: number;
  views: number;
  isTrending?: boolean;
  isStaffPick?: boolean;
  creator: CreatorInfo;
  createdAt: string;
}

export interface AIToolItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  url: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
}

export const INITIAL_AI_TOOLS: AIToolItem[] = [
  {
    id: 'tool-bing',
    name: 'Bing Image Creator',
    category: 'Viral Image Art',
    tagline: 'Free DALL-E 3 image generator powering viral social media trends.',
    description: 'Generate 3D wings name art, viral portraits, and cinematic visuals for free with Microsoft Copilot.',
    pricing: 'Free',
    url: 'https://bing.com/create',
    badge: '100% Free',
    rating: 4.9,
    reviewsCount: 15400
  },
  {
    id: 'tool-midjourney',
    name: 'Midjourney v6',
    category: 'Generative Art',
    tagline: 'Industry benchmark for photorealism, cinematic lighting, and artistic control.',
    description: 'Create museum-quality illustrations, 35mm photography, and UI asset concepts with natural language.',
    pricing: 'Paid',
    url: 'https://midjourney.com',
    badge: 'Top Rated',
    rating: 4.9,
    reviewsCount: 12400
  },
  {
    id: 'tool-flux',
    name: 'FLUX.1',
    category: 'Open Source Imaging',
    tagline: 'State-of-the-art open-weights image synthesis by Black Forest Labs.',
    description: 'Excels at complex anatomy, legible typography in renders, and diverse artistic style adherence.',
    pricing: 'Open Source',
    url: 'https://blackforestlabs.ai',
    badge: 'Open Weights',
    rating: 4.8,
    reviewsCount: 3800
  }
];

export const AI_MODELS = [
  'All Models',
  'Nano Banana',
  'Bing Image Creator',
  'Midjourney v6',
  'FLUX.1',
  'Stable Diffusion XL'
] as const;

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  bio: string;
  rank: number;
  points: number;
  savedPromptIds: string[];
  uploadedPromptIds: string[];
}

export const INITIAL_CREATORS: CreatorInfo[] = [
  {
    name: 'Aarav Mehta',
    handle: '@aarav_ai',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    badge: '🏆 #1 Grandmaster',
    points: 14820,
    rank: 1,
    isFollowing: true,
  },
  {
    name: 'Elena Rostova',
    handle: '@elena_cinema',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    badge: '✨ Top Creator',
    points: 12940,
    rank: 2,
    isFollowing: false,
  },
  {
    name: 'Kabir & Sanya',
    handle: '@viral_bing_prompts',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    badge: '🔥 Viral Legend',
    points: 11200,
    rank: 3,
    isFollowing: true,
  },
  {
    name: 'Aksh Beniwal',
    handle: '@aksh_promptcare',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    badge: '⚡ Rising Star',
    points: 9840,
    rank: 4,
    isFollowing: false,
  },
  {
    name: 'Mei Lin',
    handle: '@cyber_mei',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    badge: '💎 Pro Artist',
    points: 8750,
    rank: 5,
    isFollowing: false,
  }
];

export const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: 'faymas-1',
    title: '3D Wings Neon Name Art (Viral Social Media DP)',
    description: 'The viral 3D avatar sitting relaxed on an obsidian throne with glowing electric wings and customized 3D neon name on the wall.',
    category: 'Viral Bing',
    model: 'Bing Image Creator',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '1:1',
    negativePrompt: 'deformed wings, blurry text, low resolution, ugly face, distorted fingers',
    promptTemplate: `Create a realistic 3D illusion of a stylish 20-year-old boy sitting comfortably on a glowing futuristic throne. The character is wearing a casual black oversized hoodie with sneakers and dark sunglasses. Behind the throne are majestic glowing cyan neon wings. The background features a dark obsidian wall with the name "AKSH" boldly illuminated in 3D glowing neon typography. Volumetric smoke, 8k resolution, cinematic lighting.`,
    tags: ['Viral', '3D Wings', 'Neon Art', 'Instagram DP', 'Bing AI'],
    likes: 1420,
    copies: 8940,
    views: 24500,
    isTrending: true,
    isStaffPick: true,
    creator: INITIAL_CREATORS[2],
    createdAt: '2 hours ago'
  },
  {
    id: 'faymas-2',
    title: 'Cinematic 35mm Vintage Portrait on Kodak Portra 400',
    description: 'Breathtaking 35mm analog film aesthetic with natural pores, freckles, soft golden hour sidelight, and authentic shallow depth of field.',
    category: 'Portraits',
    model: 'Midjourney v6',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    negativePrompt: 'plastic skin, oversaturated, deformed eyes, extra limbs, cartoonish, 3d render',
    promptTemplate: `cinematic 35mm photograph of a thoughtful 24-year-old woman in a minimalist linen shirt, captured on Kodak Portra 400 film, natural subtle pores and freckles, soft warm afternoon sidelight, shallow depth of field, f/1.8 lens, detailed background of sunlit balcony garden, muted cinematic color grading, authentic film grain, photorealistic, 8k --ar 3:4 --style raw --v 6.0`,
    tags: ['Cinematic', '35mm Film', 'Portrait', 'Photorealism', 'Vintage'],
    likes: 1890,
    copies: 6420,
    views: 31200,
    isTrending: true,
    isStaffPick: true,
    creator: INITIAL_CREATORS[1],
    createdAt: '5 hours ago'
  },
  {
    id: 'faymas-3',
    title: 'Neon Cyberpunk Street Samurai Portrait',
    description: 'Rain-soaked Shinjuku alley reflections, volumetric holographic haze, tactical street techwear, and rim lighting.',
    category: 'Cyberpunk',
    model: 'Nano Banana',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '9:16',
    negativePrompt: 'blurry, oversaturated, anime, cartoon, bad anatomy',
    promptTemplate: `cyberpunk portrait of an urban street mercenary standing in a rain-drenched Tokyo back-alley, illuminated by neon magenta and cyan holographic signs. Wearing black modular techwear jacket with luminous collar, transparent cyber-visors reflecting street lights, volumetric steam rising from asphalt, cinematic 8k photograph, Hasselblad camera quality`,
    tags: ['Cyberpunk', 'Nano Banana', 'Techwear', 'Neon', 'Urban'],
    likes: 960,
    copies: 4810,
    views: 18400,
    isTrending: true,
    isStaffPick: false,
    creator: INITIAL_CREATORS[4],
    createdAt: '1 day ago'
  },
  {
    id: 'faymas-4',
    title: 'Aesthetic Rooftop Couple at Golden Hour Sunset',
    description: 'Candid warm sun-flare romantic photography with natural bokeh, genuine smiles, and cozy city skyline background.',
    category: 'Aesthetic',
    model: 'Bing Image Creator',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    negativePrompt: 'mutated hands, blurry faces, low quality, oversaturated cartoon, stiff poses',
    promptTemplate: `A realistic candid 35mm photo of a stylish young couple laughing together on a rooftop cafe during golden hour sunset. Soft amber sun rays creating gentle lens flare, wind blowing through hair, city skyline softly blurred in background, natural candid smiles, authentic film grain, ultra-detailed 8k resolution`,
    tags: ['Aesthetic', 'Couple', 'Golden Hour', 'Viral Reels', 'Sunset'],
    likes: 1340,
    copies: 5930,
    views: 22800,
    isTrending: true,
    isStaffPick: true,
    creator: INITIAL_CREATORS[0],
    createdAt: '1 day ago'
  },
  {
    id: 'faymas-5',
    title: 'High-Fashion Editorial Studio Monochrome Portrait',
    description: 'Avant-garde black and white studio lighting, sharp chiselled jawline, heavy contrast chiaroscuro, and silk drape textures.',
    category: 'Fashion',
    model: 'FLUX.1',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    negativePrompt: 'low contrast, muddy shadows, plastic skin, bad eyes',
    promptTemplate: `editorial high-fashion black and white studio portrait of a handsome model, strong chiaroscuro lighting inspired by Peter Lindbergh, dramatic shadow play across cheekbones, silk shirt collar slightly unbuttoned, intense gaze into camera, captured on Leica M11 Monochrom, 8k resolution, timeless vogue photography`,
    tags: ['Fashion', 'Studio', 'Editorial', 'Monochrome', 'FLUX'],
    likes: 820,
    copies: 3670,
    views: 15400,
    isTrending: false,
    isStaffPick: true,
    creator: INITIAL_CREATORS[1],
    createdAt: '2 days ago'
  },
  {
    id: 'faymas-6',
    title: 'Y2K Retro Aesthetic Flash Portrait with Retro Sunglasses',
    description: 'Direct disposable camera flash photography, vintage 2000s vibes, chrome jewelry, and cool retro street mood.',
    category: 'Aesthetic',
    model: 'Nano Banana',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '9:16',
    negativePrompt: 'hdr, modern flat lighting, cartoon, oversaturated, deformed hands',
    promptTemplate: `raw direct-flash candid photo of a stylish 21-year-old girl in Y2K fashion, wearing oversized silver sunglasses and metallic cropped jacket, shot on vintage Olympus Stylus Epic 35mm point-and-shoot camera, hard shadows on white wall behind, authentic vintage film grain, casual cool expression, retro party vibe, 2000s aesthetic`,
    tags: ['Y2K', 'Retro Flash', '35mm', 'Nano Banana', 'Street Style'],
    likes: 1150,
    copies: 5120,
    views: 20100,
    isTrending: true,
    isStaffPick: false,
    creator: INITIAL_CREATORS[3],
    createdAt: '2 days ago'
  },
  {
    id: 'faymas-7',
    title: 'Traditional Royal Heritage Portrait (Indian Royal Aesthetic)',
    description: 'Intricately embroidered velvet sherwani, antique emerald jewelry, candlelit palace courtyard, and majestic ambiance.',
    category: 'Portraits',
    model: 'Midjourney v6',
    imageUrl: 'https://images.unsplash.com/photo-1614036417651-efe5912149d8?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '1:1',
    negativePrompt: 'cheap modern clothes, deformed jewelry, cartoon face, flat lighting',
    promptTemplate: `cinematic regal portrait of a royal Indian prince sitting in an antique palace courtyard in Jaipur during twilight, wearing a deep maroon velvet handcrafted sherwani with intricate antique gold zardozi embroidery and emerald necklace, warm candlelight illumination from brass lamps, soft atmospheric haze, royal luxury photography, 8k resolution, Hasselblad lens --ar 1:1 --v 6.0`,
    tags: ['Royal', 'Heritage', 'Indian Aesthetic', 'Portrait', 'Luxury'],
    likes: 1470,
    copies: 7200,
    views: 28900,
    isTrending: true,
    isStaffPick: true,
    creator: INITIAL_CREATORS[0],
    createdAt: '3 days ago'
  },
  {
    id: 'faymas-8',
    title: 'Cozy Rain Cafe Window Portrait with Steamy Latte',
    description: 'Raindrops running down the glass window, soft warm cafe interior lights, knit woolen sweater, and melancholic mood.',
    category: 'Aesthetic',
    model: 'Stable Diffusion XL',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    negativePrompt: 'dry window, blurry face, bad anatomy, overexposed',
    promptTemplate: `atmospheric portrait of a cozy woman sitting next to a rainy cafe window, holding a warm ceramic cup with latte art, raindrops running down the glass creating soft bokeh reflections of city traffic outside, wearing chunky knit cream sweater, natural peaceful expression, soft moody interior lighting, 8k photo`,
    tags: ['Cozy', 'Rainy Cafe', 'Moody', 'Coffee', 'Aesthetic'],
    likes: 890,
    copies: 4210,
    views: 16700,
    isTrending: false,
    isStaffPick: false,
    creator: INITIAL_CREATORS[2],
    createdAt: '3 days ago'
  },
  {
    id: 'faymas-9',
    title: 'Anime Lofi Studio Bedroom with Sunset Haze',
    description: 'Makoto Shinkai aesthetic, warm dusty sunlight beaming through blinds, plants, cat sleeping on desk, and digital tablet.',
    category: 'Anime',
    model: 'Midjourney v6',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    negativePrompt: 'bad linework, muddy colors, 3d render, distorted architecture',
    promptTemplate: `breathtaking anime scenery of an artist bedroom at sunset, golden dust motes floating in warm light beams coming through window blinds, desk covered in sketchbooks and drawing monitor, cozy cat curled up on chair, soft pastels and vibrant orange sky outside, Makoto Shinkai style, highly detailed wallpaper 4k`,
    tags: ['Anime', 'Lofi', 'Sunset', 'Aesthetic', 'Shinkai'],
    likes: 1650,
    copies: 8120,
    views: 33400,
    isTrending: true,
    isStaffPick: true,
    creator: INITIAL_CREATORS[4],
    createdAt: '4 days ago'
  },
  {
    id: 'faymas-10',
    title: 'Minimalist Architectural Shadow Silhouette Portrait',
    description: 'Clean brutalist concrete lines, dramatic geometry, morning sun cast shadows, and quiet contemplative human figure.',
    category: 'Fashion',
    model: 'Nano Banana',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    negativePrompt: 'messy background, clutter, low resolution, bad shadows',
    promptTemplate: `minimalist architectural portrait of a man standing against a massive raw beige concrete wall in modern museum, sharp geometric morning shadow slicing diagonally across the scene, clean tailored slate gray coat, architectural symmetry, shot on 50mm prime lens, serene modern aesthetic, 8k`,
    tags: ['Minimalist', 'Architecture', 'Shadows', 'Nano Banana', 'Editorial'],
    likes: 710,
    copies: 3100,
    views: 12900,
    isTrending: false,
    isStaffPick: false,
    creator: INITIAL_CREATORS[3],
    createdAt: '4 days ago'
  }
];

export const CATEGORIES = [
  'All',
  'Viral Bing',
  'Portraits',
  'Aesthetic',
  'Cyberpunk',
  'Fashion',
  'Anime'
] as const;

export const STYLE_PRESETS = [
  {
    id: 'cinematic',
    name: 'Cinematic 35mm',
    promptSnippet: 'captured on Kodak Portra 400 film, 35mm lens, natural skin pores and subtle freckles, warm volumetric sidelight, cinematic bokeh, 8k photo',
    negativeSnippet: 'plastic skin, airbrushed, cartoon, low resolution',
    sampleImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3d-neon',
    name: '3D Wings Neon (Viral DP)',
    promptSnippet: '3D illusion of character on obsidian throne with majestic glowing cyan neon wings, 3D neon name illuminated on dark wall behind, volumetric smoke, 8k render',
    negativeSnippet: 'deformed wings, blurry text, low quality',
    sampleImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'y2k-flash',
    name: 'Y2K Retro Flash',
    promptSnippet: 'direct disposable camera flash, 2000s aesthetic, retro silver sunglasses, hard wall shadow, authentic grainy vintage 35mm party photo',
    negativeSnippet: 'hdr, modern flat lighting, digital art, cartoon',
    sampleImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    promptSnippet: 'rainy Tokyo alley neon reflections, black techwear jacket, holographic visor, atmospheric steam, 8k photorealistic futuristic portrait',
    negativeSnippet: 'flat, oversaturated cartoon, blurry',
    sampleImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'studio-glam',
    name: 'Studio Lighting',
    promptSnippet: 'high-end commercial studio beauty portrait, butterfly lighting setup, razor sharp focus on eyes, crisp hair definition, magazine cover quality',
    negativeSnippet: 'unfocused, muddy shadows, low res',
    sampleImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'anime-shinkai',
    name: 'Anime Aesthetic',
    promptSnippet: 'Makoto Shinkai style anime visual, soft sunset golden hour, floating dust particles, painterly clouds, vibrant emotive composition',
    negativeSnippet: 'realistic photograph, 3d cgi, muddy colors',
    sampleImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  }
];

export const CURRENT_USER_DEFAULT: UserProfile = {
  id: 'user-aksh',
  name: 'Aksh Beniwal',
  handle: '@aksh_promptcare',
  email: 'akshbeniwal98@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  bio: 'Prompt Engineer & Creator building PromptCare.online. Love 35mm film & viral Bing 3D art.',
  rank: 4,
  points: 9840,
  savedPromptIds: ['faymas-1', 'faymas-2', 'faymas-4'],
  uploadedPromptIds: ['faymas-1', 'faymas-6', 'faymas-10']
};
