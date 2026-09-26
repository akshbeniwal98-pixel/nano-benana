import React, { useState, useRef, useEffect } from 'react';
import { PromptItem, STYLE_PRESETS, UserProfile } from '../data/prompts';
import { fetchAIPrompt, generateRealisticPromptLocally, GeneratedPromptResult, PromptVariation } from '../utils/promptGenerator';
import { ThemeMode } from './ThemeSwitcher';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Download, 
  Send, 
  Copy, 
  Check, 
  Layers, 
  RefreshCw,
  Sliders,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Camera,
  Star,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  Eye,
  Grid
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  result?: GeneratedPromptResult;
  selectedVarId?: string;
  timestamp: string;
}

interface NanoBananaStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishToFeed: (prompt: PromptItem) => void;
  onTriggerToast: (msg: string) => void;
  currentUser: UserProfile | null;
  initialPrompt?: string;
  initialStyle?: string;
  theme?: ThemeMode;
}

export const NanoBananaStudioModal: React.FC<NanoBananaStudioModalProps> = ({
  isOpen,
  onClose,
  onPublishToFeed,
  onTriggerToast,
  currentUser,
  initialPrompt = '',
  initialStyle = '',
  theme = 'dark',
}) => {
  // Active Tab: 'chat' (ChatGPT style prompt generator) | 'selfie' (Photo-to-AI Avatar) | 'canvas' (Manual generator)
  const [activeTab, setActiveTab] = useState<'chat' | 'selfie' | 'canvas'>('chat');

  // Photo-to-Avatar / Selfie Mode state
  const [userUploadedSelfie, setUserUploadedSelfie] = useState<string | null>(
    currentUser?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80'
  );
  const [selfieCustomName, setSelfieCustomName] = useState(
    currentUser?.name?.split(' ')[0]?.toUpperCase() || 'AKSH'
  );
  const [selfieTransformStyle, setSelfieTransformStyle] = useState<string>('wings');
  const [isSelfieTransforming, setIsSelfieTransforming] = useState(false);
  const [selfieTransformProgress, setSelfieTransformProgress] = useState(0);
  const [selfieOutputVars, setSelfieOutputVars] = useState<PromptVariation[] | null>(null);
  const [selectedSelfieOutputVarId, setSelectedSelfieOutputVarId] = useState<string>('var-1');
  const [selfieGeneratedPrompt, setSelfieGeneratedPrompt] = useState<string>('');

  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleSelfieFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserUploadedSelfie(event.target.result as string);
          onTriggerToast('Photo upload ho gayi! Ab style select karke Transform karein.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransformSelfie = () => {
    setIsSelfieTransforming(true);
    setSelfieTransformProgress(15);
    const interval = setInterval(() => {
      setSelfieTransformProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setSelfieTransformProgress(100);
      setIsSelfieTransforming(false);
      
      const query = `${selfieTransformStyle} portrait of young person with custom name "${selfieCustomName}" based on facial features`;
      const res = generateRealisticPromptLocally(query, selfieTransformStyle);
      setSelfieOutputVars(res.variations);
      setSelectedSelfieOutputVarId(res.variations[0].id);
      setSelfieGeneratedPrompt(res.prompt);
      onTriggerToast(`🍌 Aapki photo se 4 AI variations ready ho gayi hain name "${selfieCustomName}" ke saath!`);
    }, 1200);
  };

  const handlePublishSelfieFavorite = () => {
    if (!selfieOutputVars) return;
    const fav = selfieOutputVars.find(v => v.id === selectedSelfieOutputVarId) || selfieOutputVars[0];
    const newPrompt: PromptItem = {
      id: `selfie-ai-${Date.now()}`,
      title: `${selfieCustomName}'s AI Portrait (${fav.label})`,
      description: `Personalized AI photo created from user selfie with ${fav.styleTweak}.`,
      category: 'Viral Bing',
      model: 'Nano Banana',
      promptTemplate: selfieGeneratedPrompt,
      imageUrl: fav.imageUrl,
      aspectRatio: '1:1',
      tags: ['Personalized AI', selfieCustomName, 'Selfie to Avatar', 'Nano Banana'],
      likes: 1,
      copies: 0,
      views: 1,
      isTrending: true,
      creator: currentUser ? {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: userUploadedSelfie || currentUser.avatar,
        badge: '🍌 AI Creator',
      } : {
        name: selfieCustomName,
        handle: `@${selfieCustomName.toLowerCase()}`,
        avatar: userUploadedSelfie || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
        badge: '🍌 Creator',
      },
      createdAt: 'Just now'
    };
    onPublishToFeed(newPrompt);
    onTriggerToast('🚀 Aapki AI photo feed par publish ho gayi!');
    onClose();
  };

  // Chatbot state
  const [chatInput, setChatInput] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initial welcome message from Nano Banana
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste! 👋 Main Nano Banana hoon—aapka AI Photo Prompt Assistant. Ab main ek sath 4 different photo variations (V1, V2, V3, V4) simultaneously generate karta hoon. Aap unme se apna favorite choose kar sakte hain!',
      timestamp: 'Just now',
    }
  ]);

  // Canvas Mode state
  const [promptText, setPromptText] = useState(
    initialPrompt || 'Hyperrealistic 3D portrait of a stylish boy on a futuristic throne with glowing cyan angel wings, name "AKSH" glowing in 3D neon on dark obsidian wall, volumetric lighting, 8k resolution'
  );
  const [selectedStyle, setSelectedStyle] = useState(initialStyle || '3d-neon');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9' | '3:4'>('1:1');
  const [negativePrompt, setNegativePrompt] = useState('blurry, deformed, bad anatomy, cartoon, low quality');
  
  // Simultaneous Variations Generation state for Canvas mode
  const [variationCount, setVariationCount] = useState<2 | 4>(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // 4 Default Initial Variations
  const [canvasVariations, setCanvasVariations] = useState<PromptVariation[]>([
    { id: 'v-1', label: 'V1 (Cyan Electric Wings)', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', styleTweak: 'Volumetric cyan smoke & dark obsidian raytracing' },
    { id: 'v-2', label: 'V2 (Golden Angelic Embers)', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', styleTweak: 'Warm golden particle embers & dramatic rim backlight' },
    { id: 'v-3', label: 'V3 (Dark Fantasy Obsidian)', imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80', styleTweak: 'Deep shadow contrast & sharp 3D metallic highlights' },
    { id: 'v-4', label: 'V4 (Vibrant Violet Aura)', imageUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80', styleTweak: 'Neon magenta and violet particle aura in 8k render' },
  ]);

  const [selectedCanvasVarId, setSelectedCanvasVarId] = useState<string>('v-1');
  const [canvasCopied, setCanvasCopied] = useState(false);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  if (!isOpen) return null;

  // ChatGPT-style Quick Ideas
  const QUICK_IDEAS = [
    { label: '🪽 3D Wings Name on Jacket', idea: '3D boy with glowing neon wings, name "AKSH" written on black jacket' },
    { label: '📸 35mm Vintage Film Portrait', idea: 'Aesthetic vintage 90s Polaroid portrait of an Indian girl in Delhi market' },
    { label: '🏍️ Royal Enfield Night Rider', idea: 'Stylish 24-year-old boy on matte black bullet bike under street lights' },
    { label: '👑 Traditional Royal Bride', idea: 'Royal Indian bride in heavy crimson lehenga with antique gold zardozi and Polki jewelry' },
    { label: '🌧️ Cyberpunk Monsoon Neon', idea: 'Cyberpunk futuristic girl in rainy Mumbai neon alley with reflections' },
  ];

  // Handle Chat Submit (ChatGPT style)
  const handleSendChatMessage = async (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query || isBotThinking) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBotThinking(true);

    try {
      const result = await fetchAIPrompt(query, selectedStyle);

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: result.responseMessage,
        result,
        selectedVarId: result.variations[0]?.id || 'var-1',
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, botMsg]);
      onTriggerToast('🍌 Generated 4 variations! Select your favorite.');
    } catch (error) {
      console.error('Error generating prompt:', error);
      const localResult = generateRealisticPromptLocally(query);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: localResult.responseMessage,
        result: localResult,
        selectedVarId: localResult.variations[0]?.id || 'var-1',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsBotThinking(false);
    }
  };

  // Change selected favorite variation in a chat message
  const handleSelectChatVariation = (msgId: string, varId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, selectedVarId: varId };
      }
      return m;
    }));
    onTriggerToast(`Selected variation as favorite! ⭐`);
  };

  // Copy helper
  const handleCopyText = (text: string, id: string, msg: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      onTriggerToast(msg);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Publish Favorite from Chat Result to Feed
  const handlePublishFromChat = (result: GeneratedPromptResult, chosenVarId?: string) => {
    const chosenVar = result.variations.find(v => v.id === chosenVarId) || result.variations[0];
    const newPrompt: PromptItem = {
      id: `nano-chat-${Date.now()}`,
      title: result.title,
      description: `${chosenVar.label} - ${result.cameraSettings}`,
      category: result.category as any || 'Portraits',
      model: 'Nano Banana',
      promptTemplate: `${result.prompt} (${chosenVar.styleTweak})`,
      imageUrl: chosenVar.imageUrl,
      aspectRatio: result.aspectRatio,
      negativePrompt: result.negativePrompt,
      tags: [...result.tags, chosenVar.label.split(' ')[0]],
      likes: 1,
      copies: 0,
      views: 1,
      isTrending: true,
      creator: currentUser ? {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        badge: '🍌 AI Creator',
      } : {
        name: 'Guest Artist',
        handle: '@guest_artist',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        badge: '🍌 Nano Artist',
      },
      createdAt: 'Just now'
    };

    onPublishToFeed(newPrompt);
    onTriggerToast('🚀 Published favorite variation to PromptCare feed!');
    onClose();
  };

  // Canvas Mode Handlers
  const handleApplyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    setSelectedStyle(preset.id);
    if (!promptText.includes(preset.promptSnippet)) {
      setPromptText((prev) => `${prev.trim()}, ${preset.promptSnippet}`);
    }
    setNegativePrompt(preset.negativeSnippet);
    onTriggerToast(`Applied ${preset.name} style preset!`);
  };

  // Run simultaneous variations generation in Canvas
  const handleGenerateCanvasVariations = () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setGenerationProgress(15);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 20;
      });
    }, 280);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      setIsGenerating(false);

      // Generate 4 fresh themed variations simultaneously
      const localResult = generateRealisticPromptLocally(promptText, selectedStyle);
      const generatedVars = localResult.variations.slice(0, variationCount);

      setCanvasVariations(generatedVars);
      setSelectedCanvasVarId(generatedVars[0].id);
      onTriggerToast(`🍌 Generated ${variationCount} simultaneous variations! Select your favorite.`);
    }, 1400);
  };

  const handlePublishCanvasFavorite = () => {
    const favoriteVar = canvasVariations.find(v => v.id === selectedCanvasVarId) || canvasVariations[0];
    if (!favoriteVar) return;

    const newPrompt: PromptItem = {
      id: `user-${Date.now()}`,
      title: `${promptText.slice(0, 42)}... (${favoriteVar.label})`,
      description: `Generated in Nano Banana Studio with ${selectedStyle} style. Selected favorite: ${favoriteVar.label}`,
      category: 'Portraits',
      model: 'Nano Banana',
      promptTemplate: `${promptText} (${favoriteVar.styleTweak})`,
      imageUrl: favoriteVar.imageUrl,
      aspectRatio,
      negativePrompt,
      tags: ['Nano Banana', selectedStyle, favoriteVar.label.split(' ')[0]],
      likes: 1,
      copies: 0,
      views: 1,
      isTrending: true,
      creator: currentUser ? {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        badge: '🍌 AI Creator',
      } : {
        name: 'Guest Artist',
        handle: '@guest_creator',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        badge: '🍌 Nano Artist',
      },
      createdAt: 'Just now'
    };

    onPublishToFeed(newPrompt);
    onTriggerToast('🚀 Published favorite variation to community feed!');
    onClose();
  };

  // Dynamic Theme Colors
  const modalBg =
    theme === 'light'
      ? 'bg-white text-slate-900 border-slate-200'
      : theme === 'night'
        ? 'bg-[#000000] text-zinc-100 border-zinc-800'
        : 'bg-[#0B0F19] text-slate-100 border-slate-700/80';

  const cardSurface =
    theme === 'light'
      ? 'bg-slate-50 border-slate-200'
      : theme === 'night'
        ? 'bg-zinc-950 border-zinc-800'
        : 'bg-slate-900/90 border-slate-800';

  const botMsgBg =
    theme === 'light'
      ? 'bg-slate-100 border-slate-200 text-slate-800'
      : theme === 'night'
        ? 'bg-[#0c0c0e] border-zinc-800/80 text-zinc-200'
        : 'bg-slate-900 border-slate-800/80 text-slate-200';

  const inputBg =
    theme === 'light'
      ? 'bg-white border-slate-200 text-slate-900 focus:ring-cyan-600'
      : theme === 'night'
        ? 'bg-zinc-900 border-zinc-800 text-white focus:ring-cyan-400'
        : 'bg-slate-950 border-slate-700/80 text-white focus:ring-cyan-500';

  // Active favorite in canvas mode
  const currentCanvasFavorite = canvasVariations.find(v => v.id === selectedCanvasVarId) || canvasVariations[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div 
        className={`rounded-3xl max-w-5xl w-full h-[92vh] max-h-[880px] shadow-2xl relative border flex flex-col overflow-hidden transition-colors ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
          theme === 'light' ? 'border-slate-200 bg-slate-50' : theme === 'night' ? 'border-zinc-800 bg-zinc-950' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center text-xl shadow-md">
              🍌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  Nano Banana AI Studio
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold flex items-center gap-1">
                  <Grid className="w-3 h-3" />
                  Multi-Variations Engine
                </span>
              </div>
              <p className={`text-[11px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Simultaneously generate multiple variations & pick your favorite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher Tabs */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${
              theme === 'light' ? 'bg-slate-200 border-slate-300' : theme === 'night' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>ChatGPT Mode</span>
              </button>

              <button
                onClick={() => setActiveTab('selfie')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'selfie'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
                title="Apni photo upload karke AI avatar banayein"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Apni Photo Se Banao</span>
              </button>

              <button
                onClick={() => setActiveTab('canvas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'canvas'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Manual Studio</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                theme === 'light' ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: CHATGPT-STYLE NANO BANANA PROMPT & VARIATIONS */}
        {/* ======================================================== */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Quick Inspiration Idea Chips */}
            <div className={`px-4 sm:px-6 py-2.5 border-b overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0 ${
              theme === 'light' ? 'bg-slate-100/70 border-slate-200' : theme === 'night' ? 'bg-zinc-950/80 border-zinc-900' : 'bg-slate-950/50 border-slate-800/80'
            }`}>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold shrink-0 ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                ⚡ Quick Prompts:
              </span>
              {QUICK_IDEAS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChatMessage(item.idea)}
                  className={`text-xs px-3 py-1 rounded-full shrink-0 border transition-all cursor-pointer flex items-center gap-1 font-medium ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 hover:border-cyan-600 text-slate-700 hover:text-cyan-700 shadow-sm'
                      : theme === 'night'
                        ? 'bg-zinc-900 border-zinc-800 hover:border-cyan-400 text-zinc-300 hover:text-white'
                        : 'bg-slate-900 border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages Feed (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    {msg.sender === 'assistant' ? (
                      <>
                        <div className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 text-xs flex items-center justify-center font-bold">
                          🍌
                        </div>
                        <span className="text-xs font-bold text-amber-400">Nano Banana Copilot</span>
                      </>
                    ) : (
                      <>
                        <span className={`text-xs font-bold ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>You</span>
                        <div className="w-5 h-5 rounded-md bg-cyan-500 text-slate-950 text-xs flex items-center justify-center font-bold">
                          👤
                        </div>
                      </>
                    )}
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-3xl w-full rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white shadow-md max-w-xl'
                      : `border shadow-sm ${botMsgBg}`
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Result Prompt Card & Multiple Variations Grid */}
                    {msg.result && (
                      <div className={`mt-4 pt-4 border-t space-y-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
                        
                        {/* Title & Metadata Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className={`font-bold text-sm sm:text-base ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {msg.result.title}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-600 text-white font-bold">
                              Bing / Midjourney v6
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-400 text-slate-950 font-bold">
                              --ar {msg.result.aspectRatio}
                            </span>
                          </div>
                        </div>

                        {/* Camera Optics Spec Banner */}
                        <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-[11px] ${
                          theme === 'light' 
                            ? 'bg-amber-50 border-amber-200 text-amber-900' 
                            : 'bg-amber-400/10 border-amber-400/20 text-amber-300'
                        }`}>
                          <Camera className="w-4 h-4 shrink-0 text-amber-400" />
                          <span className="font-mono">{msg.result.cameraSettings}</span>
                        </div>

                        {/* Main Photorealistic Prompt Box */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                              Photorealistic Prompt:
                            </span>
                            <button
                              onClick={() => handleCopyText(msg.result!.prompt, `p-${msg.id}`, 'Prompt copied to clipboard! Ready to paste into Bing / Midjourney')}
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === `p-${msg.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Prompt</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className={`p-3 rounded-xl border font-mono text-xs leading-relaxed select-all ${
                            theme === 'light'
                              ? 'bg-white border-slate-200 text-slate-900'
                              : theme === 'night'
                                ? 'bg-black border-zinc-800 text-cyan-200'
                                : 'bg-slate-950 border-slate-800 text-cyan-200'
                          }`}>
                            {msg.result.prompt}
                          </div>
                        </div>

                        {/* ======================================================== */}
                        {/* 4 SIMULTANEOUS VARIATIONS SHOWCASE & FAVORITE SELECTION */}
                        {/* ======================================================== */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
                                <Sparkles className="w-3.5 h-3.5" />
                                4 Simultaneous Variations:
                              </span>
                              <span className="text-[10px] text-slate-400">
                                (Click any photo to select your favorite ⭐)
                              </span>
                            </div>

                            {/* Active Favorite Indicator Badge */}
                            {msg.selectedVarId && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 fill-current" />
                                Favorite: {msg.result.variations.find(v => v.id === msg.selectedVarId)?.label.split(' ')[0]}
                              </span>
                            )}
                          </div>

                          {/* 4 Variations Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {msg.result.variations.map((v) => {
                              const isFavorite = msg.selectedVarId === v.id;
                              return (
                                <div
                                  key={v.id}
                                  onClick={() => handleSelectChatVariation(msg.id, v.id)}
                                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                                    isFavorite
                                      ? 'ring-3 ring-amber-400 border-amber-400 shadow-xl shadow-amber-400/20 scale-[1.02]'
                                      : 'border-slate-700/80 hover:border-slate-500 opacity-80 hover:opacity-100'
                                  }`}
                                >
                                  {/* Thumbnail */}
                                  <div className="aspect-square w-full overflow-hidden bg-slate-950">
                                    <img
                                      src={v.imageUrl}
                                      alt={v.label}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>

                                  {/* Variation ID Badge */}
                                  <div className="absolute top-2 left-2 z-10">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold shadow-md ${
                                      isFavorite
                                        ? 'bg-amber-400 text-slate-950'
                                        : 'bg-black/75 backdrop-blur-md text-white border border-white/10'
                                    }`}>
                                      {v.label.split(' ')[0]}
                                    </span>
                                  </div>

                                  {/* Star Favorite Indicator Button */}
                                  <div className="absolute top-2 right-2 z-10">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                                      isFavorite
                                        ? 'bg-amber-400 text-slate-950 shadow-md scale-110'
                                        : 'bg-black/60 text-white/80 group-hover:bg-amber-400 group-hover:text-slate-950'
                                    }`}>
                                      <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </div>
                                  </div>

                                  {/* Bottom Style Caption */}
                                  <div className={`p-2 text-[10px] leading-tight transition-colors ${
                                    isFavorite 
                                      ? 'bg-amber-400 text-slate-950 font-bold' 
                                      : 'bg-slate-950/90 text-slate-300 group-hover:text-white'
                                  }`}>
                                    <div className="truncate">{v.styleTweak}</div>
                                  </div>

                                  {/* Overlay hover prompt */}
                                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none transition-opacity ${
                                    isFavorite ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                                  }`}>
                                    <span className="text-[10px] font-bold text-white bg-black/80 px-2 py-1 rounded-full border border-white/20">
                                      Select Favorite
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Selected Favorite Action Strip */}
                        <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                          theme === 'light' ? 'bg-slate-200/60 border-slate-300' : 'bg-slate-950/80 border-slate-800'
                        }`}>
                          <div className="flex items-center gap-2 text-xs">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-semibold">
                              Selected: <strong className="text-amber-400">{msg.result.variations.find(v => v.id === msg.selectedVarId)?.label}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handlePublishFromChat(msg.result!, msg.selectedVarId)}
                              className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Publish Favorite to Feed</span>
                            </button>

                            <button
                              onClick={() => {
                                const v = msg.result!.variations.find(item => item.id === msg.selectedVarId) || msg.result!.variations[0];
                                const a = document.createElement('a');
                                a.href = v.imageUrl;
                                a.download = `nano-banana-fav-${Date.now()}.jpg`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                onTriggerToast('Downloaded selected variation!');
                              }}
                              className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                                theme === 'light' ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                              }`}
                              title="Download favorite variation image"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={`https://www.bing.com/images/create?q=${encodeURIComponent(msg.result.prompt)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-900/30 border-blue-700/50 text-blue-300'
                              }`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Bing</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                </div>
              ))}

              {/* Bot Thinking Spinner Indicator */}
              {isBotThinking && (
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 text-xs flex items-center justify-center font-bold animate-spin">
                    🍌
                  </div>
                  <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${botMsgBg}`}>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Nano Banana is simultaneously rendering 4 prompt variations with optical lens calibration...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar (Bottom) */}
            <div className={`p-3 sm:p-4 border-t shrink-0 ${
              theme === 'light' ? 'bg-slate-50 border-slate-200' : theme === 'night' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex items-center gap-2 max-w-4xl mx-auto"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Apna photo idea likho... jaise: '24 saal ka ladka bullet par night rain me with name AKSH'..."
                    disabled={isBotThinking}
                    className={`w-full pl-4 pr-10 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${inputBg}`}
                  />
                  {chatInput && (
                    <button
                      type="button"
                      onClick={() => setChatInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!chatInput.trim() || isBotThinking}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Generate 4 Variations</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: APNI PHOTO SE BANAO (SELFIE / FACE TO AI AVATAR) */}
        {/* ======================================================== */}
        {activeTab === 'selfie' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Photo Upload & Style Controls (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Photo Upload Box */}
                <div>
                  <label className="text-xs font-bold flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Camera className="w-4 h-4" />
                      Step 1: Apni Photo ya Selfie Upload Karein *
                    </span>
                    {userUploadedSelfie && (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Photo Ready
                      </span>
                    )}
                  </label>

                  <div 
                    onClick={() => selfieInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                      theme === 'light'
                        ? 'border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/30'
                        : 'border-slate-700/80 hover:border-amber-400 bg-slate-950/60 hover:bg-slate-900/60'
                    }`}
                  >
                    <input
                      ref={selfieInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieFileUpload}
                      className="hidden"
                    />

                    {userUploadedSelfie ? (
                      <div className="flex items-center gap-4 w-full">
                        <img
                          src={userUploadedSelfie}
                          alt="Uploaded selfie"
                          className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                        />
                        <div className="text-left flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">Aapki Selected Photo</div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Click karein doosri photo choose karne ke liye</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                            Face & Features Detected
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          📸
                        </div>
                        <div className="text-xs font-bold text-slate-200">
                          Apne phone ya computer se photo chunein
                        </div>
                        <p className="text-[11px] text-slate-500">
                          PNG, JPG, WebP supported. Clear face selfie works best.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Step 2: Custom Name on Photo / Jacket */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-200">
                    Step 2: Photo / Jacket / Wall par kaunsa Naam chahiye? *
                  </label>
                  <input
                    type="text"
                    value={selfieCustomName}
                    onChange={(e) => setSelfieCustomName(e.target.value.toUpperCase())}
                    placeholder="e.g. AKSH, RAHUL, AMAN..."
                    className={`w-full px-3.5 py-2.5 rounded-2xl border font-mono text-xs sm:text-sm font-bold uppercase tracking-wider ${inputBg}`}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Yeh naam aapki AI photo ke jacket, background neon wall ya motorcycle par likha aayega.
                  </p>
                </div>

                {/* Step 3: Choose AI Transformation Style */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-slate-200">
                    Step 3: Kis Style me photo banani hai?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'wings', title: '🪽 3D Wings & Throne', desc: 'Obsidian throne + neon wings + Name on wall' },
                      { id: 'bike', title: '🏍️ Royal Enfield Night', desc: 'Bullet bike in rain + Name on jacket' },
                      { id: 'traditional', title: '👑 Royal Rajputana Look', desc: 'Palace courtyard + Royal traditional attire' },
                      { id: 'portrait', title: '📸 35mm Vintage Film', desc: 'Kodak Portra 400 + Natural skin pores' },
                      { id: 'cyberpunk', title: '🌧️ Cyberpunk Neon Rain', desc: 'Futuristic Tokyo neon + Techwear jacket' },
                    ].map(st => {
                      const isSel = selfieTransformStyle === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setSelfieTransformStyle(st.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md'
                              : `${cardSurface} hover:border-amber-400/50`
                          }`}
                        >
                          <div className="text-xs font-bold truncate">{st.title}</div>
                          <div className={`text-[10px] truncate mt-0.5 ${isSel ? 'text-slate-800' : 'text-slate-400'}`}>
                            {st.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Transform Button */}
                <button
                  type="button"
                  onClick={handleTransformSelfie}
                  disabled={isSelfieTransforming || !userUploadedSelfie}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-xl shadow-amber-400/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSelfieTransforming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                      <span>Synthesizing Face with AI... {selfieTransformProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      <span>🍌 Transform My Photo (Generate 4 AI Variations)</span>
                    </>
                  )}
                </button>

              </div>

              {/* Right Column: Generated 4 AI Variations from Selfie (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className={`p-4 rounded-3xl border ${cardSurface}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Transformed Output
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selfieOutputVars ? '(Click photo to select favorite)' : ''}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-bold">
                      Name: {selfieCustomName}
                    </span>
                  </div>

                  {selfieOutputVars ? (
                    <>
                      {/* 4 Generated Variations Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {selfieOutputVars.map(v => {
                          const isSel = selectedSelfieOutputVarId === v.id;
                          return (
                            <div
                              key={v.id}
                              onClick={() => setSelectedSelfieOutputVarId(v.id)}
                              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                                isSel
                                  ? 'ring-3 ring-amber-400 border-amber-400 shadow-xl shadow-amber-400/25 scale-[1.02]'
                                  : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                              }`}
                            >
                              <div className="aspect-square bg-slate-950 overflow-hidden relative">
                                <img
                                  src={v.imageUrl}
                                  alt={v.label}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold ${
                                  isSel ? 'bg-amber-400 text-slate-950' : 'bg-black/75 text-white backdrop-blur-md'
                                }`}>
                                  {v.label.split(' ')[0]}
                                </span>

                                <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md ${
                                  isSel ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-black/60 text-white'
                                }`}>
                                  <Star className={`w-3.5 h-3.5 ${isSel ? 'fill-current' : ''}`} />
                                </div>
                              </div>

                              <div className={`p-2 text-[10px] truncate leading-tight ${
                                isSel ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-950/90 text-slate-300'
                              }`}>
                                {v.styleTweak}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Favorite Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                        <button
                          type="button"
                          onClick={handlePublishSelfieFavorite}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 stroke-[2.5]" />
                          <span>Publish My Photo to PromptCare Feed</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const fav = selfieOutputVars.find(v => v.id === selectedSelfieOutputVarId) || selfieOutputVars[0];
                              const a = document.createElement('a');
                              a.href = fav.imageUrl;
                              a.download = `my-ai-photo-${selfieCustomName}.jpg`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              onTriggerToast('Downloaded your AI photo!');
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download 8K</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(selfieGeneratedPrompt);
                              onTriggerToast('Customized prompt copied to clipboard!');
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Initial Empty State Guide */
                    <div className="py-12 px-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center text-3xl mx-auto shadow-inner">
                        📸
                      </div>
                      <h4 className="text-sm font-bold text-slate-200">
                        Apni photo se AI Portrait kaise banayein:
                      </h4>
                      <div className="text-xs text-slate-400 text-left space-y-2 max-w-sm mx-auto bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                          <span>Left side par apni koi bhi selfie ya photo upload karein.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                          <span>Apna name likhein jo photo/jacket par chahiye.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                          <span>3D Wings, Bullet Biker, ya Royal Palace style chunein.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                          <span>"Transform My Photo" par click karein—4 variations ready ho jayengi!</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MANUAL STUDIO CANVAS & MULTI-VARIATIONS */}
        {/* ======================================================== */}
        {activeTab === 'canvas' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Controls (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Prompt Input Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                      Detailed Photo Prompt *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(promptText);
                        setCanvasCopied(true);
                        setTimeout(() => setCanvasCopied(false), 2000);
                        onTriggerToast('Copied prompt to clipboard!');
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {canvasCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{canvasCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe your subject, lighting, mood, camera..."
                    className={`w-full px-3.5 py-2.5 rounded-2xl border font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${inputBg}`}
                  />
                </div>

                {/* Simultaneous Variation Count Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold flex items-center gap-1.5">
                      <Grid className="w-3.5 h-3.5 text-amber-400" />
                      Simultaneous Variations Count:
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {variationCount} Rendered Concurrently
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVariationCount(2)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        variationCount === 2
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                          : `${cardSurface} text-slate-300 hover:border-slate-600`
                      }`}
                    >
                      <span>2 Variations (Side-by-Side)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVariationCount(4)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        variationCount === 4
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                          : `${cardSurface} text-slate-300 hover:border-slate-600`
                      }`}
                    >
                      <span>4 Variations (2x2 Quad Grid)</span>
                    </button>
                  </div>
                </div>

                {/* Quick Style Presets Chips */}
                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Quick Style Presets:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STYLE_PRESETS.map((preset) => {
                      const isSelected = selectedStyle === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md'
                              : `${cardSurface} hover:border-amber-400/50`
                          }`}
                        >
                          <div className="text-xs font-semibold truncate">{preset.name}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                            {preset.id}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect Ratio Selector */}
                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Aspect Ratio:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['1:1', '9:16', '16:9', '3:4'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                          aspectRatio === ratio
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                            : `${cardSurface} text-slate-300 hover:border-slate-600`
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Negative Prompt */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-400">
                    Negative Prompt (Elements to avoid):
                  </label>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none ${inputBg}`}
                  />
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerateCanvasVariations}
                  disabled={isGenerating || !promptText.trim()}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-xl shadow-amber-400/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                      <span>Generating {variationCount} Variations... {generationProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      <span>Generate {variationCount} Variations Simultaneously</span>
                    </>
                  )}
                </button>

              </div>

              {/* Right Column: Variations Quad Grid & Favorite Action (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className={`p-4 rounded-3xl border ${cardSurface}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Grid className="w-3.5 h-3.5 text-amber-400" />
                        Simultaneous Variations Output
                      </span>
                      <span className="text-[10px] text-slate-400">(Click to select favorite)</span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-bold">
                      {aspectRatio}
                    </span>
                  </div>

                  {/* Variations Grid (2x2) */}
                  <div className={`grid gap-3 ${variationCount === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {canvasVariations.map((v) => {
                      const isSelected = selectedCanvasVarId === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            setSelectedCanvasVarId(v.id);
                            onTriggerToast(`Selected ${v.label} as favorite! ⭐`);
                          }}
                          className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                            isSelected
                              ? 'ring-3 ring-amber-400 border-amber-400 shadow-xl shadow-amber-400/25 scale-[1.02]'
                              : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                          }`}
                        >
                          {/* Image */}
                          <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                            <img
                              src={v.imageUrl}
                              alt={v.label}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Loading overlay during generation */}
                            {isGenerating && (
                              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-2">
                                <div className="w-8 h-8 rounded-full border-3 border-amber-400 border-t-transparent animate-spin mb-1" />
                                <span className="text-[9px] font-mono text-amber-300">{generationProgress}%</span>
                              </div>
                            )}

                            {/* Badge */}
                            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold shadow-md ${
                              isSelected ? 'bg-amber-400 text-slate-950' : 'bg-black/75 text-white backdrop-blur-md'
                            }`}>
                              {v.label.split(' ')[0]}
                            </span>

                            {/* Star Badge */}
                            <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 shadow-md scale-110'
                                : 'bg-black/60 text-white group-hover:bg-amber-400 group-hover:text-slate-950'
                            }`}>
                              <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-current' : ''}`} />
                            </div>
                          </div>

                          {/* Caption */}
                          <div className={`p-2 text-[10px] transition-colors leading-tight ${
                            isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-950/90 text-slate-300'
                          }`}>
                            <div className="truncate">{v.styleTweak}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Selected Favorite Banner & Controls */}
                  {currentCanvasFavorite && (
                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-semibold">
                            Active Favorite: <strong className="text-amber-400">{currentCanvasFavorite.label}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">8K Rendered</span>
                      </div>

                      <button
                        type="button"
                        onClick={handlePublishCanvasFavorite}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 stroke-[2.5]" />
                        <span>Publish Selected Favorite ({currentCanvasFavorite.label.split(' ')[0]}) to Feed</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = currentCanvasFavorite.imageUrl;
                            a.download = `nano-banana-fav-${Date.now()}.jpg`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            onTriggerToast(`Downloaded ${currentCanvasFavorite.label.split(' ')[0]} image!`);
                          }}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Favorite</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleGenerateCanvasVariations}
                          disabled={isGenerating}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                          <span>Re-roll 4 Variations</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
