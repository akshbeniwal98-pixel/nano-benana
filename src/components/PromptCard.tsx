import React, { useState } from 'react';
import { PromptItem } from '../data/prompts';
import { Copy, Check, Heart, Eye, Sliders, Sparkles, ExternalLink, Trash2 } from 'lucide-react';

interface PromptCardProps {
  prompt: PromptItem;
  onOpenDetails: (prompt: PromptItem) => void;
  onLike: (id: string) => void;
  isLiked: boolean;
  onTriggerToast: (msg: string) => void;
  onDeletePrompt?: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onOpenDetails,
  onLike,
  isLiked,
  onTriggerToast,
  onDeletePrompt,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.promptTemplate).then(() => {
      setCopied(true);
      onTriggerToast(`Prompt copied! Ready to paste into ${prompt.model}`);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      onTriggerToast('Prompt copied!');
    });
  };

  const getToolUrl = (model: string) => {
    if (model.includes('Bing')) return 'https://www.bing.com/images/create';
    if (model.includes('Midjourney')) return 'https://midjourney.com';
    if (model.includes('FLUX')) return 'https://blackforestlabs.ai';
    if (model.includes('Claude')) return 'https://claude.ai';
    return 'https://chatgpt.com';
  };

  const getModelBadge = (model: string) => {
    if (model.includes('Bing')) {
      return 'bg-blue-600/90 text-white border-blue-400/50 shadow-sm';
    }
    if (model.includes('Midjourney')) {
      return 'bg-indigo-600/90 text-white border-indigo-400/50 shadow-sm';
    }
    if (model.includes('Claude')) {
      return 'bg-amber-600/90 text-white border-amber-400/50 shadow-sm';
    }
    if (model.includes('FLUX')) {
      return 'bg-purple-600/90 text-white border-purple-400/50 shadow-sm';
    }
    return 'bg-emerald-600/90 text-white border-emerald-400/50 shadow-sm';
  };

  return (
    <div 
      onClick={() => onOpenDetails(prompt)}
      className="group rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/30 hover:-translate-y-1 cursor-pointer relative"
    >
      <div>
        {/* Visual Thumbnail (Faymas.in style) */}
        {prompt.imageUrl ? (
          <div className="relative w-full h-52 overflow-hidden bg-slate-950">
            <img 
              src={prompt.imageUrl} 
              alt={prompt.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

            {/* Model & Aspect Ratio Badges on Image */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border backdrop-blur-md ${getModelBadge(prompt.model)}`}>
                {prompt.model}
              </span>
              {prompt.aspectRatio && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-slate-200 border border-white/20">
                  {prompt.aspectRatio}
                </span>
              )}
            </div>

            {/* Staff pick badge */}
            {prompt.isStaffPick && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 shadow-md">
                  Trending
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-24 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getModelBadge(prompt.model)}`}>
              {prompt.model}
            </span>
            <span className="text-xs text-slate-400 font-medium">{prompt.category}</span>
          </div>
        )}

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-cyan-400">
              {prompt.category}
            </span>
            <span className="text-[11px] text-slate-400">
              by {prompt.creator?.name || prompt.author || 'Creator'}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 leading-snug line-clamp-1">
            {prompt.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {prompt.description}
          </p>

          {/* Prompt Snippet Box (Faymas.in style) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 line-clamp-3 leading-relaxed relative">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-bold mb-1">
              Prompt
            </div>
            {prompt.promptTemplate}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Likes & Views */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(prompt.id);
              }}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLiked ? 'text-rose-400' : 'hover:text-rose-400'
              }`}
              title="Like this prompt"
            >
              <Heart 
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`} 
              />
              <span className="font-mono text-xs">{prompt.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <span className="text-slate-700">·</span>

            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono">{prompt.views}</span>
            </div>

            {/* Optional delete button for user submitted prompts */}
            {onDeletePrompt && prompt.id.startsWith('user-') && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePrompt(prompt.id);
                }}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Delete this prompt"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: Try / Copy */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(prompt);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              title="View full prompt & instructions"
            >
              View
            </button>

            <button
              onClick={handleCopy}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
              title="Copy prompt text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
