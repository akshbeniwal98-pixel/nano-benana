/**
 * PromptCare.online - Client Application Engine
 * Handles AI image generation fetch calls, Pinterest-style masonry grid rendering,
 * LocalStorage caching, and interactive modals.
 */

// 1. Initial Curated Faymas.in Style Community Prompts
const CURATED_PROMPTS = [
  {
    id: 'pc-1',
    title: '3D Wings Neon Name Art (Viral Social Media DP)',
    category: 'Viral Bing',
    model: 'Bing Image Creator',
    aspectRatio: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    promptTemplate: 'Create a realistic 3D illusion of a stylish 20-year-old boy sitting comfortably on a glowing futuristic throne. Casual black oversized hoodie, dark sunglasses. Behind the throne are majestic glowing cyan neon wings. The dark obsidian wall features the name "AKSH" boldly illuminated in 3D neon typography. Volumetric smoke, 8k resolution, raytracing.',
    creator: 'Aksh Beniwal',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    likes: 1420,
    copies: 8940
  },
  {
    id: 'pc-2',
    title: 'Cinematic 35mm Vintage Portrait (Kodak Portra)',
    category: 'Portraits',
    model: 'Midjourney v6',
    aspectRatio: '9:16',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    promptTemplate: 'Raw 35mm candid street photograph of an Indian girl in Delhi market, natural skin pores and subtle freckles, warm volumetric sidelight, Kodak Portra 400 film grain, cinematic depth of field, 8k resolution, photorealistic.',
    creator: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    likes: 980,
    copies: 6410
  },
  {
    id: 'pc-3',
    title: 'Royal Enfield Night Rider in Rain',
    category: 'Portraits',
    model: 'DALL-E 3',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    promptTemplate: 'Cinematic night photography of a rugged stylish 24-year-old man seated on a custom vintage matte-black Royal Enfield motorcycle on rain-slicked city avenue. Leather biker jacket with "AKSH" embossed in white thread. Wet road reflections, 8k resolution.',
    creator: 'Aksh Beniwal',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    likes: 850,
    copies: 4120
  },
  {
    id: 'pc-4',
    title: 'Royal Heritage Rajputana Bridal Look',
    category: 'Portraits',
    model: 'Midjourney v6',
    aspectRatio: '9:16',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    promptTemplate: 'Award-winning portrait of an elegant royal Indian bride in crimson raw silk lehenga with antique gold zardozi embroidery and Polki diamond jewelry. Sunlit carved sandstone palace jharokha during golden hour, Vogue India aesthetic, 8k.',
    creator: 'Devraj Chauhan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    likes: 1240,
    copies: 7300
  },
  {
    id: 'pc-5',
    title: 'Cyberpunk Monsoon Neon Operative',
    category: 'Cyberpunk',
    model: 'FLUX.1',
    aspectRatio: '9:16',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    promptTemplate: 'Ultra-detailed cinematic portrait of a cyber-operative in heavy monsoon rain in futuristic cyberpunk alley. Neon cyan and magenta signs reflect off transparent techwear trench coat. Raindrops cascading, shot on Hasselblad X2D 100C, 8k.',
    creator: 'Mei Lin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    likes: 670,
    copies: 3820
  },
  {
    id: 'pc-6',
    title: 'Y2K Retro Flash Analog Aesthetic',
    category: 'Aesthetic',
    model: 'Bing Image Creator',
    aspectRatio: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    promptTemplate: 'Direct disposable camera flash, 2000s party aesthetic, retro silver sunglasses, hard wall shadow, authentic grainy vintage 35mm photograph, effortless cool model pose.',
    creator: 'Sara Connor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    likes: 540,
    copies: 2900
  },
  {
    id: 'pc-7',
    title: 'High-Fashion Studio Editorial Beauty',
    category: 'Fashion',
    model: 'Midjourney v6',
    aspectRatio: '9:16',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    promptTemplate: 'High-end commercial studio beauty portrait, butterfly softbox lighting setup, razor sharp focus on eyes, crisp hair definition, magazine cover aesthetic, 8k resolution RAW photo.',
    creator: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    likes: 910,
    copies: 5120
  },
  {
    id: 'pc-8',
    title: 'Anime Shinkai Twilight Clouds',
    category: 'Anime',
    model: 'FLUX.1',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    promptTemplate: 'Makoto Shinkai style anime visual, soft sunset golden hour, floating dust particles, painterly voluminous clouds, vibrant emotive composition, masterpiece digital painting.',
    creator: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    likes: 780,
    copies: 4600
  }
];

const CATEGORIES = ['All', 'Viral Bing', 'Portraits', 'Aesthetic', 'Cyberpunk', 'Fashion', 'Anime'];

// 2. Application State with LocalStorage Caching
let userPosts = [];
try {
  const cached = localStorage.getItem('promptcare_posts');
  if (cached) userPosts = JSON.parse(cached);
} catch (e) {
  console.warn('LocalStorage error:', e);
}

let allPrompts = [...userPosts, ...CURATED_PROMPTS];
let activeCategory = 'All';
let searchQuery = '';
let likedPromptIds = new Set(JSON.parse(localStorage.getItem('promptcare_likes') || '["pc-1"]'));

// Studio State
let studioSelectedRatio = '1:1';
let studioSelectedStyle = 'cinematic';
let lastGeneratedImage = null;
let lastGeneratedPrompt = '';
let activeDetailPrompt = null;

// Theme State
let currentTheme = localStorage.getItem('promptcare_theme') || 'dark';

// 3. DOM Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const categoryPillsContainer = document.getElementById('category-pills');
const masonryFeed = document.getElementById('masonry-feed');
const feedTitle = document.getElementById('feed-title');
const feedCountBadge = document.getElementById('feed-count-badge');
const resetFilterBtn = document.getElementById('reset-filter-btn');

// Studio Modal Elements
const studioModal = document.getElementById('studio-modal');
const openStudioBtn = document.getElementById('open-studio-btn');
const closeStudioBtn = document.getElementById('close-studio-btn');
const studioPromptInput = document.getElementById('studio-prompt-input');
const triggerGenerateBtn = document.getElementById('trigger-generate-btn');
const studioResultImage = document.getElementById('studio-result-image');
const studioLoadingOverlay = document.getElementById('studio-loading-overlay');
const providerBadge = document.getElementById('provider-badge');
const publishFeedBtn = document.getElementById('publish-feed-btn');
const copyStudioPromptBtn = document.getElementById('copy-studio-prompt-btn');
const downloadImageBtn = document.getElementById('download-image-btn');

// Detail Modal Elements
const detailModal = document.getElementById('detail-modal');
const closeDetailBtn = document.getElementById('close-detail-btn');
const detailImg = document.getElementById('detail-img');
const detailTitle = document.getElementById('detail-title');
const detailPrompt = document.getElementById('detail-prompt');
const detailModelBadge = document.getElementById('detail-model-badge');
const detailCopyBtn = document.getElementById('detail-copy-btn');
const detailCopyFullBtn = document.getElementById('detail-copy-full-btn');
const detailTryStudioBtn = document.getElementById('detail-try-studio-btn');

// 4. Toast Notification Function
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  toastText.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2800);
}

// 5. Render Categories Pills
function renderCategories() {
  categoryPillsContainer.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const isAct = cat === activeCategory;
    const btn = document.createElement('button');
    btn.className = `px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
      isAct 
        ? 'bg-white text-slate-950 shadow-md' 
        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
    }`;
    btn.textContent = cat === 'All' ? 'All Prompts' : `#${cat}`;
    btn.onclick = () => filterCategory(cat);
    categoryPillsContainer.appendChild(btn);
  });
}

function filterCategory(cat) {
  activeCategory = cat;
  renderCategories();
  renderFeed();
}

// 6. Render Pinterest-Style Masonry Grid
function renderFeed() {
  let list = allPrompts;

  if (activeCategory !== 'All') {
    list = list.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.promptTemplate.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.creator.toLowerCase().includes(q)
    );
  }

  // Update header and count
  feedTitle.textContent = activeCategory === 'All' ? 'Trending Community Prompts' : `#${activeCategory} Prompts`;
  feedCountBadge.textContent = `${list.length} Prompts`;

  if (activeCategory !== 'All' || searchQuery) {
    resetFilterBtn.classList.remove('hidden');
  } else {
    resetFilterBtn.classList.add('hidden');
  }

  masonryFeed.innerHTML = '';

  if (list.length === 0) {
    masonryFeed.innerHTML = `
      <div class="col-span-full py-20 text-center rounded-3xl border border-slate-800 bg-slate-900/40">
        <div class="text-3xl mb-3">🍌</div>
        <h3 class="text-base font-bold text-white mb-1">No matching prompts found</h3>
        <p class="text-xs text-slate-400 mb-4">Try searching another term or generate one now in AI Studio!</p>
        <button onclick="openStudio()" class="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer">
          Open AI Studio
        </button>
      </div>
    `;
    return;
  }

  list.forEach(item => {
    const isLiked = likedPromptIds.has(item.id);
    const card = document.createElement('div');
    card.className = 'break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 hover:border-cyan-500/60 transition-all duration-300 cursor-pointer shadow-md';
    card.onclick = () => openDetail(item);

    const modelBadgeClass = item.model.includes('Bing') 
      ? 'bg-blue-600 text-white' 
      : item.model.includes('Midjourney') 
        ? 'bg-indigo-600 text-white' 
        : item.model.includes('FLUX') 
          ? 'bg-purple-600 text-white' 
          : 'bg-amber-500 text-slate-950 font-bold';

    card.innerHTML = `
      <div class="relative w-full overflow-hidden bg-slate-950">
        <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105">
        
        <!-- Aspect Ratio Badge -->
        <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-black/75 backdrop-blur-md text-slate-200 border border-white/10">
          ${item.aspectRatio || '1:1'}
        </span>

        <!-- Model Badge -->
        <span class="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-lg text-[10px] font-medium tracking-wide ${modelBadgeClass}">
          ${item.model}
        </span>

        <!-- Like Button -->
        <button class="like-btn absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
          isLiked ? 'bg-rose-500 text-white shadow-lg' : 'bg-black/60 text-white hover:bg-black/80'
        }">
          <svg class="w-4 h-4 ${isLiked ? 'fill-current' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>

        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-10">
          <button class="quick-copy-btn w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg mb-2">
            <span>📋 Copy Prompt</span>
          </button>
          <p class="text-[11px] font-mono text-cyan-200 line-clamp-2 bg-black/60 p-2 rounded-xl border border-white/10 mb-2">
            ${item.promptTemplate}
          </p>
        </div>
      </div>

      <!-- Static Card Caption -->
      <div class="p-3 bg-slate-900">
        <h3 class="text-xs font-bold text-slate-200 group-hover:text-cyan-400 line-clamp-1 mb-1 transition-colors">
          ${item.title}
        </h3>
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <div class="flex items-center gap-1.5 truncate">
            <img src="${item.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'}" class="w-4 h-4 rounded-full object-cover">
            <span class="truncate">${item.creator}</span>
          </div>
          <span class="text-[10px] font-mono">${item.copies || 0} copies</span>
        </div>
      </div>
    `;

    // Quick Copy on card button
    const copyBtn = card.querySelector('.quick-copy-btn');
    copyBtn.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(item.promptTemplate).then(() => {
        showToast('Prompt copied to clipboard! 📋');
      });
    };

    // Like toggle
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.onclick = (e) => {
      e.stopPropagation();
      if (likedPromptIds.has(item.id)) {
        likedPromptIds.delete(item.id);
        item.likes = Math.max(0, item.likes - 1);
        showToast('Removed like');
      } else {
        likedPromptIds.add(item.id);
        item.likes += 1;
        showToast('Liked prompt! ❤️');
      }
      localStorage.setItem('promptcare_likes', JSON.stringify(Array.from(likedPromptIds)));
      renderFeed();
    };

    masonryFeed.appendChild(card);
  });
}

// 7. Search Input Handlers
searchInput.oninput = (e) => {
  searchQuery = e.target.value;
  if (searchQuery.trim()) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }
  renderFeed();
};

clearSearchBtn.onclick = () => {
  searchInput.value = '';
  searchQuery = '';
  clearSearchBtn.classList.add('hidden');
  renderFeed();
};

resetFilterBtn.onclick = () => {
  activeCategory = 'All';
  searchQuery = '';
  searchInput.value = '';
  clearSearchBtn.classList.add('hidden');
  renderCategories();
  renderFeed();
};

// 8. In-App AI Studio Logic
function openStudio(prefilledPrompt = '') {
  studioModal.classList.remove('hidden');
  studioModal.classList.add('flex');
  if (prefilledPrompt) {
    studioPromptInput.value = prefilledPrompt;
  }
}

function closeStudio() {
  studioModal.classList.add('hidden');
  studioModal.classList.remove('flex');
}

openStudioBtn.onclick = () => openStudio();
closeStudioBtn.onclick = () => closeStudio();
studioModal.onclick = (e) => {
  if (e.target === studioModal) closeStudio();
};

// Quick chips in studio
document.querySelectorAll('.quick-chip').forEach(chip => {
  chip.onclick = () => {
    studioPromptInput.value = chip.getAttribute('data-idea');
    showToast('Applied prompt preset!');
  };
});

// Aspect ratio selector
document.querySelectorAll('.ratio-btn').forEach(btn => {
  btn.onclick = () => {
    studioSelectedRatio = btn.getAttribute('data-ratio');
    document.querySelectorAll('.ratio-btn').forEach(b => {
      b.className = 'ratio-btn py-2 px-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-mono font-bold hover:border-slate-500';
    });
    btn.className = 'ratio-btn py-2 px-3 rounded-xl border border-cyan-500 bg-cyan-500 text-slate-950 text-xs font-mono font-bold shadow-md';
  };
});

// Style preset selector
document.querySelectorAll('.style-btn').forEach(btn => {
  btn.onclick = () => {
    studioSelectedStyle = btn.getAttribute('data-style');
    document.querySelectorAll('.style-btn').forEach(b => {
      b.className = 'style-btn p-2 rounded-xl text-left border border-slate-800 bg-slate-900 text-slate-300 text-xs';
      b.querySelector('div:last-child').className = 'text-[10px] text-slate-500';
    });
    btn.className = 'style-btn p-2 rounded-xl text-left border border-amber-400 bg-amber-400 text-slate-950 font-bold text-xs shadow-md';
    btn.querySelector('div:last-child').className = 'text-[10px] text-slate-800';
  };
});

// 9. Call POST /api/generate-image
triggerGenerateBtn.onclick = async () => {
  const prompt = studioPromptInput.value.trim();
  if (!prompt) {
    showToast('Please type a prompt description first!');
    studioPromptInput.focus();
    return;
  }

  // Set loading state
  studioLoadingOverlay.classList.remove('hidden');
  triggerGenerateBtn.disabled = true;
  triggerGenerateBtn.classList.add('opacity-50', 'cursor-not-allowed');

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        size: studioSelectedRatio,
        style: studioSelectedStyle,
        modelProvider: 'auto'
      })
    });

    const data = await response.json();

    if (data.success && data.imageUrl) {
      lastGeneratedImage = data.imageUrl;
      lastGeneratedPrompt = data.revisedPrompt || prompt;

      // Update image viewport
      studioResultImage.src = data.imageUrl;
      providerBadge.textContent = data.provider || 'AI Generated';
      showToast('Image generated successfully! 🍌');
    } else {
      showToast(data.error || 'Failed to generate image.');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    showToast('Connection error. Retrying with fallback...');
  } finally {
    studioLoadingOverlay.classList.add('hidden');
    triggerGenerateBtn.disabled = false;
    triggerGenerateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
};

// Copy Prompt from Studio
copyStudioPromptBtn.onclick = () => {
  const p = lastGeneratedPrompt || studioPromptInput.value.trim();
  if (!p) {
    showToast('No prompt to copy!');
    return;
  }
  navigator.clipboard.writeText(p).then(() => {
    showToast('Copied prompt to clipboard! 📋');
  });
};

// Download Image
downloadImageBtn.onclick = () => {
  const url = studioResultImage.src;
  if (!url) return;
  const a = document.createElement('a');
  a.href = url;
  a.download = `promptcare-${Date.now()}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Downloading image...');
};

// Publish to Masonry Feed
publishFeedBtn.onclick = () => {
  if (!lastGeneratedImage) {
    showToast('Please generate an image first!');
    return;
  }

  const pText = lastGeneratedPrompt || studioPromptInput.value.trim();
  const newPost = {
    id: `user-${Date.now()}`,
    title: pText.slice(0, 48) + '...',
    category: 'Portraits',
    model: providerBadge.textContent || 'Nano Banana',
    aspectRatio: studioSelectedRatio,
    imageUrl: lastGeneratedImage,
    promptTemplate: pText,
    creator: 'You (Creator)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    likes: 1,
    copies: 0
  };

  userPosts.unshift(newPost);
  try {
    localStorage.setItem('promptcare_posts', JSON.stringify(userPosts));
  } catch (e) {}

  allPrompts.unshift(newPost);
  closeStudio();
  showToast('Published to PromptCare feed! 🚀');
  renderFeed();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 10. Detail Modal Logic
function openDetail(item) {
  activeDetailPrompt = item;
  detailImg.src = item.imageUrl;
  detailTitle.textContent = item.title;
  detailPrompt.textContent = item.promptTemplate;
  detailModelBadge.textContent = item.model;
  detailModal.classList.remove('hidden');
  detailModal.classList.add('flex');
}

function closeDetail() {
  detailModal.classList.add('hidden');
  detailModal.classList.remove('flex');
}

closeDetailBtn.onclick = () => closeDetail();
detailModal.onclick = (e) => {
  if (e.target === detailModal) closeDetail();
};

const copyDetailHandler = () => {
  if (activeDetailPrompt) {
    navigator.clipboard.writeText(activeDetailPrompt.promptTemplate).then(() => {
      showToast('Prompt copied to clipboard! Ready to paste into Bing / Midjourney');
    });
  }
};

detailCopyBtn.onclick = copyDetailHandler;
detailCopyFullBtn.onclick = copyDetailHandler;

detailTryStudioBtn.onclick = () => {
  if (activeDetailPrompt) {
    const text = activeDetailPrompt.promptTemplate;
    closeDetail();
    openStudio(text);
  }
};

// 11. Theme Switcher
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

function applyTheme(mode) {
  currentTheme = mode;
  localStorage.setItem('promptcare_theme', mode);
  const html = document.documentElement;
  const body = document.body;

  if (mode === 'light') {
    html.className = 'light';
    body.className = 'bg-[#F8FAFC] text-slate-900 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-900';
    themeIcon.textContent = '☀️';
    themeLabel.textContent = 'Light';
  } else if (mode === 'night') {
    html.className = 'dark';
    body.className = 'bg-[#000000] text-zinc-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200';
    themeIcon.textContent = '🌌';
    themeLabel.textContent = 'Night';
  } else {
    html.className = 'dark';
    body.className = 'bg-[#0B0F19] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200';
    themeIcon.textContent = '🌙';
    themeLabel.textContent = 'Dark';
  }
}

themeBtn.onclick = () => {
  if (currentTheme === 'dark') applyTheme('night');
  else if (currentTheme === 'night') applyTheme('light');
  else applyTheme('dark');
};

// 12. Initialize App
applyTheme(currentTheme);
renderCategories();
renderFeed();
