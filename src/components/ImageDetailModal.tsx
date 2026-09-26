import React, { useState } from 'react';
import { PromptItem, UserProfile } from '../data/prompts';
import { 
  X, 
  Copy, 
  Check, 
  Heart, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  Wand2, 
  Download, 
  UserCheck, 
  ShieldAlert, 
  Share2 
} from 'lucide-react';

interface ImageDetailModalProps {
  prompt: PromptItem | null;
  onClose: () => void;
  onLike: (id: string) => void;
  isLiked: boolean;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
  onTriggerToast: (msg: string) => void;
  onTryInStudio: (prompt: PromptItem) => void;
  currentUser: UserProfile | null;
}

export const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  prompt,
  onClose,
  onLike,
  isLiked,
  onToggleSave,
  isSaved,
  onTriggerToast,
  onTryInStudio,
}) => {
  if (!prompt) return null;

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.promptTemplate).then(() => {
      setCopiedPrompt(true);
      onTriggerToast(`Prompt copied to clipboard! Ready for ${prompt.model}`);
      setTimeout(() => setCopiedPrompt(false), 2200);
    });
  };

  const handleCopyNegative = () => {
    if (!prompt.negativePrompt) return;
    navigator.clipboard.writeText(prompt.negativePrompt).then(() => {
      setCopiedNegative(true);
      onTriggerToast('Negative prompt copied!');
      setTimeout(() => setCopiedNegative(false), 2000);
    });
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = prompt.imageUrl;
    a.download = `promptcare-${prompt.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onTriggerToast('Downloaded image!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: prompt.title,
        text: `Check out this AI prompt on PromptCare: "${prompt.title}"`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onTriggerToast('Share link copied to clipboard!');
    }
  };

  const getToolUrl = (model: string) => {
    if (model.includes('Bing')) return 'https://www.bing.com/images/create';
    if (model.includes('Midjourney')) return 'https://midjourney.com';
    if (model.includes('FLUX')) return 'https://blackforestlabs.ai';
    return 'https://chatgpt.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-y-auto p-4 sm:p-7 shadow-2xl relative text-slate-100 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pinterest Style Split Layout (Image on Left, Prompt details on Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Full-Resolution Image (5 cols) */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            <img
              src={prompt.imageUrl}
              alt={prompt.title}
              className="w-full h-auto max-h-[70vh] object-cover"
            />
            
            {/* Aspect Ratio Badge */}
            {prompt.aspectRatio && (
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-black/75 backdrop-blur-md text-white border border-white/10">
                {prompt.aspectRatio}
              </span>
            )}

            {/* Download Quick Button */}
            <button
              onClick={handleDownload}
              className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/75 hover:bg-black text-white backdrop-blur-md border border-white/10 transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Prompt Metadata & One-Click Copy (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Top Row: Creator Details */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={prompt.creator.avatar}
                  alt={prompt.creator.name}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{prompt.creator.name}</span>
                    {prompt.creator.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/60">
                        {prompt.creator.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {prompt.creator.handle} · {prompt.createdAt}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  onTriggerToast(isFollowing ? `Unfollowed ${prompt.creator.name}` : `Following ${prompt.creator.name}!`);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {prompt.model}
                </span>
                <span className="text-xs text-slate-400 font-medium">#{prompt.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {prompt.title}
              </h2>
            </div>

            {/* Large 1-Click Copy Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Tested AI Prompt:</span>
                <span className="text-[11px] font-mono text-slate-500">1-Click Clipboard Ready</span>
              </div>
              
              <div className="relative p-4 rounded-2xl bg-slate-950 border border-slate-800 selection:bg-cyan-500/30">
                <pre className="text-xs sm:text-sm font-mono text-cyan-200 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed pr-2">
                  {prompt.promptTemplate}
                </pre>
              </div>

              {/* Big Primary Copy Button */}
              <button
                onClick={handleCopyPrompt}
                className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  copiedPrompt
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:brightness-110 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Prompt Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 stroke-[2.5]" />
                    <span>Copy Full Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* Negative Prompt (if available) */}
            {prompt.negativePrompt && (
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Negative Prompt
                  </span>
                  <button
                    onClick={handleCopyNegative}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    {copiedNegative ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-300 leading-snug">
                  {prompt.negativePrompt}
                </p>
              </div>
            )}

            {/* Action Bar (Studio, Like, Save, Share) */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onTryInStudio(prompt);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
              >
                <span className="text-sm">🍌</span>
                <span>Open in Nano Banana Studio</span>
              </button>

              <button
                onClick={() => onLike(prompt.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isLiked
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{prompt.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button
                onClick={() => onToggleSave(prompt.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSaved
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title="Share prompt link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {prompt.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-mono"
                >
                  #{t}
                </span>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
