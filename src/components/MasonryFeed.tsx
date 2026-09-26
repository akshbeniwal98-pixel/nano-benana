import React, { useState } from 'react';
import { PromptItem, UserProfile } from '../data/prompts';
import { Copy, Check, Heart, Eye, Sparkles, ExternalLink, Wand2, Trash2 } from 'lucide-react';
import { ThemeMode } from './ThemeSwitcher';

interface MasonryFeedProps {
  prompts: PromptItem[];
  onOpenDetails: (prompt: PromptItem) => void;
  onLike: (id: string) => void;
  likedIds: Set<string>;
  onTriggerToast: (msg: string) => void;
  onTryInStudio: (prompt: PromptItem) => void;
  onDeletePrompt?: (id: string) => void;
  currentUser: UserProfile | null;
  theme: ThemeMode;
}

export const MasonryFeed: React.FC<MasonryFeedProps> = ({
  prompts,
  onOpenDetails,
  onLike,
  likedIds,
  onTriggerToast,
  onTryInStudio,
  onDeletePrompt,
  currentUser,
  theme,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, prompt: PromptItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.promptTemplate).then(() => {
      setCopiedId(prompt.id);
      onTriggerToast(`Copied prompt! Ready to paste into ${prompt.model}`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getModelBadge = (model: string) => {
    if (model.includes('Nano Banana')) {
      return 'bg-amber-500 text-slate-950 font-extrabold shadow-sm';
    }
    if (model.includes('Bing')) {
      return 'bg-blue-600 text-white font-bold shadow-sm';
    }
    if (model.includes('Midjourney')) {
      return 'bg-indigo-600 text-white font-bold shadow-sm';
    }
    if (model.includes('FLUX')) {
      return 'bg-purple-600 text-white font-bold shadow-sm';
    }
    return 'bg-emerald-600 text-white font-bold shadow-sm';
  };

  const cardBgClass =
    theme === 'light'
      ? 'bg-white border-slate-200/90 hover:border-cyan-500 shadow-sm hover:shadow-xl'
      : theme === 'night'
        ? 'bg-[#0a0a0c] border-zinc-800 hover:border-cyan-400 shadow-md shadow-black'
        : 'bg-slate-900 border-slate-800/80 hover:border-cyan-500/50 shadow-md';

  const captionBgClass =
    theme === 'light'
      ? 'bg-white text-slate-800'
      : theme === 'night'
        ? 'bg-[#0a0a0c] text-zinc-200'
        : 'bg-slate-900 text-slate-200';

  const titleClass =
    theme === 'light'
      ? 'text-slate-900 group-hover:text-cyan-700'
      : 'text-slate-200 group-hover:text-cyan-400';

  const subtextClass =
    theme === 'light'
      ? 'text-slate-500'
      : 'text-slate-400';

  return (
    <div className="w-full columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4">
      {prompts.map((prompt) => {
        const isLiked = likedIds.has(prompt.id);
        const isCopied = copiedId === prompt.id;
        const isAuthor = currentUser && (currentUser.name === prompt.creator.name || prompt.id.startsWith('user-'));

        return (
          <div
            key={prompt.id}
            onClick={() => onOpenDetails(prompt)}
            className={`break-inside-avoid mb-4 group relative rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer ${cardBgClass}`}
          >
            {/* High-Resolution Portrait Photo */}
            <div className="relative w-full overflow-hidden bg-slate-950">
              <img
                src={prompt.imageUrl}
                alt={prompt.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Aspect Ratio Badge on Corner */}
              {prompt.aspectRatio && (
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-black/75 backdrop-blur-md text-slate-200 border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                  {prompt.aspectRatio}
                </span>
              )}

              {/* Model Badge */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] tracking-wide ${getModelBadge(prompt.model)}`}>
                  {prompt.model === 'Nano Banana' ? '🍌 Nano Banana' : prompt.model}
                </span>
              </div>

              {/* Top Right Quick Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(prompt.id);
                }}
                className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-125 cursor-pointer ${
                  isLiked
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
                title="Like"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-white' : ''}`} />
              </button>

              {/* Pinterest-Style Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 z-10">
                
                {/* Overlay Action Buttons */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={(e) => handleCopy(e, prompt)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTryInStudio(prompt);
                    }}
                    className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-lg cursor-pointer"
                    title="Generate variations in Nano Banana Studio"
                  >
                    <Wand2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  {isAuthor && onDeletePrompt && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePrompt(prompt.id);
                      }}
                      className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                      title="Delete prompt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Prompt Snippet on Hover */}
                <p className="text-[11px] font-mono text-cyan-200 line-clamp-2 mb-2 leading-relaxed bg-black/60 p-2 rounded-xl border border-white/10">
                  {prompt.promptTemplate}
                </p>

                {/* Creator Details on Overlay */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={prompt.creator.avatar}
                      alt={prompt.creator.name}
                      className="w-5 h-5 rounded-full object-cover border border-cyan-400"
                    />
                    <span className="text-[11px] font-semibold text-white truncate">
                      {prompt.creator.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ❤️ {prompt.likes + (isLiked ? 1 : 0)}
                  </span>
                </div>

              </div>
            </div>

            {/* Static Card Caption (Pinterest style bottom title & creator) */}
            <div className={`p-3 transition-colors duration-200 ${captionBgClass}`}>
              <h3 className={`text-xs font-bold line-clamp-1 mb-1 transition-colors ${titleClass}`}>
                {prompt.title}
              </h3>
              
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 truncate">
                  <img
                    src={prompt.creator.avatar}
                    alt={prompt.creator.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className={`truncate text-[10px] ${subtextClass}`}>{prompt.creator.name}</span>
                </div>

                <span className={`text-[10px] font-mono shrink-0 ${subtextClass}`}>
                  {prompt.copies} copies
                </span>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
