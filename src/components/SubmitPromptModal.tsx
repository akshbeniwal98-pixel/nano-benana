import React, { useState } from 'react';
import { PromptItem } from '../data/prompts';
import { X, Send, Sparkles, Image as ImageIcon, Upload, Check, Link } from 'lucide-react';

interface SubmitPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: PromptItem) => void;
}

const PRESET_IMAGES = [
  { label: '3D Wings Neon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cinematic Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sunset Couple', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Isometric 3D', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Coding / Tech', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Vector Logo', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80' },
];

export const SubmitPromptModal: React.FC<SubmitPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Viral Bing' | 'Image AI' | 'Text AI' | 'Coding' | 'Business'>('Viral Bing');
  const [model, setModel] = useState<'Bing Image Creator' | 'Midjourney v6' | 'FLUX.1' | 'ChatGPT-4o' | 'Claude 3.7' | 'Kling AI'>('Bing Image Creator');
  const [description, setDescription] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [author, setAuthor] = useState('');
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !promptTemplate) return;

    // Detect variables in brackets e.g. [NAME], [GENDER]
    const matches = promptTemplate.match(/\[([A-Z0-9_]+)\]/g);
    const uniqueKeys = matches ? Array.from(new Set(matches.map(m => m.replace(/\[|\]/g, '')))) : [];
    
    const variables = uniqueKeys.map(key => ({
      key,
      label: key.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
      defaultValue: '',
      description: `Enter value for ${key.toLowerCase()}`
    }));

    const newPrompt: PromptItem = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      model: model as any,
      promptTemplate: promptTemplate.trim(),
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      aspectRatio: (aspectRatio as any) || '1:1',
      negativePrompt: negativePrompt.trim() || undefined,
      variables,
      instructions: instructions.trim() || `Paste directly into ${model}.`,
      tags: [category, model, 'Community'],
      likes: 1,
      copies: 0,
      views: 1,
      isTrending: true,
      author: author.trim() || 'PromptCare Creator',
      creator: {
        name: author.trim() || 'PromptCare Creator',
        handle: `@${(author.trim() || 'creator').toLowerCase().replace(/\s+/g, '_')}`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        badge: 'Community Creator'
      },
      createdAt: 'Just now'
    };

    onSubmit(newPrompt);
    onClose();

    // Reset
    setTitle('');
    setDescription('');
    setPromptTemplate('');
    setNegativePrompt('');
    setAuthor('');
    setInstructions('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Post New AI Prompt (Faymas style)
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">
          Add Prompt to PromptCare
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Create and publish a prompt card with image preview, customizable variables, and one-click copy.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Prompt Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3D Wings Neon Boy DP for Instagram"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Category & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Viral Bing">Viral Bing (3D / DP / Trending)</option>
                <option value="Image AI">Image AI (Midjourney / FLUX)</option>
                <option value="Text AI">Text AI (ChatGPT / Copy)</option>
                <option value="Coding">Coding & Development</option>
                <option value="Business">Business & Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                AI Tool / Model *
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Bing Image Creator">Bing Image Creator (100% Free)</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="FLUX.1">FLUX.1</option>
                <option value="ChatGPT-4o">ChatGPT-4o</option>
                <option value="Claude 3.7">Claude 3.7</option>
                <option value="Kling AI">Kling AI</option>
              </select>
            </div>
          </div>

          {/* Image Thumbnail Selection (Faymas Style) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                Prompt Preview Image (Faymas Visual Card)
              </label>
              <span className="text-[10px] text-slate-400">Choose preset or upload</span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setImageUrl(preset.url)}
                  className={`relative rounded-xl overflow-hidden h-14 border transition-all cursor-pointer ${
                    imageUrl === preset.url ? 'border-cyan-400 ring-2 ring-cyan-500/40' : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 text-[9px] bg-black/70 text-slate-200 py-0.5 text-center font-medium truncate px-1">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom URL or Upload */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct Image URL..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <Link className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>

              <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload From Device</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Short Description *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this prompt special? (e.g. Viral 3D neon avatar with your name)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Prompt Template */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-200">
                Prompt Text *
              </label>
              <span className="text-[10px] text-cyan-400 font-mono">Use [NAME], [GENDER] for variables</span>
            </div>
            <textarea
              required
              rows={4}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              placeholder="Create a realistic 3D illusion of [GENDER] sitting on a throne with [COLOR] wings and name [NAME] on the wall..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Negative Prompt & Aspect Ratio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="1:1">1:1 (Square - Instagram DP)</option>
                <option value="9:16">9:16 (Vertical - Reels / Story)</option>
                <option value="16:9">16:9 (Landscape - Desktop / YouTube)</option>
                <option value="N/A">N/A (Text / Coding prompt)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Aksh"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Publish to Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
