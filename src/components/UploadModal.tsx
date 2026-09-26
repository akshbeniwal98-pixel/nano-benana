import React, { useState } from 'react';
import { PromptItem, UserProfile } from '../data/prompts';
import { X, Upload, Send, Sparkles, Image as ImageIcon, Link } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (prompt: PromptItem) => void;
  onTriggerToast: (msg: string) => void;
  currentUser: UserProfile | null;
}

const PRESET_UPLOADS = [
  { label: '3D Wings Neon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  { label: '35mm Film Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sunset Couple', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
  { label: 'High Fashion B&W', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Y2K Retro Flash', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  onTriggerToast,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Viral Bing');
  const [model, setModel] = useState<'Nano Banana' | 'Midjourney v6' | 'Bing Image Creator' | 'FLUX.1' | 'Stable Diffusion XL'>('Bing Image Creator');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9' | '3:4'>('1:1');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_UPLOADS[0].url);
  const [tags, setTags] = useState('Viral, 3D Wings, DP');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          onTriggerToast('Loaded custom photo for upload!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !promptTemplate || !imageUrl) return;

    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    const newPrompt: PromptItem = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      description: promptTemplate.slice(0, 80) + '...',
      category,
      model,
      promptTemplate: promptTemplate.trim(),
      imageUrl,
      aspectRatio,
      negativePrompt: negativePrompt.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : ['Community', category],
      likes: 1,
      copies: 0,
      views: 1,
      isTrending: true,
      creator: currentUser ? {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        badge: '⚡ Community Creator',
      } : {
        name: 'Guest Creator',
        handle: '@guest',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        badge: 'New Creator',
      },
      createdAt: 'Just now'
    };

    onUploadSuccess(newPrompt);
    onTriggerToast('🎉 Successfully posted prompt to Pinterest feed!');
    onClose();

    // Reset
    setTitle('');
    setPromptTemplate('');
    setNegativePrompt('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative text-slate-100"
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
            Community Upload
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">
          Post an AI Prompt & Photo
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Upload photo, paste the exact tested AI prompt, and share it with the PromptCare creator community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Title / Concept *
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

          {/* Model & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                AI Model *
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
              >
                <option value="Bing Image Creator">Bing Image Creator (100% Free)</option>
                <option value="Nano Banana">🍌 Nano Banana AI</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="FLUX.1">FLUX.1</option>
                <option value="Stable Diffusion XL">Stable Diffusion XL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Viral Bing">Viral Bing (3D Wings / DP)</option>
                <option value="Portraits">Portraits & People</option>
                <option value="Aesthetic">Aesthetic & Film</option>
                <option value="Cyberpunk">Cyberpunk & Sci-Fi</option>
                <option value="Fashion">Fashion & Editorial</option>
                <option value="Anime">Anime & 2D Art</option>
              </select>
            </div>
          </div>

          {/* Photo Picker */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                Select Photo Thumbnail (Pinterest Card)
              </label>
              <span className="text-[10px] text-slate-400">Presets or device upload</span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_UPLOADS.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setImageUrl(p.url)}
                  className={`relative rounded-xl overflow-hidden h-14 border transition-all cursor-pointer ${
                    imageUrl === p.url
                      ? 'border-cyan-400 ring-2 ring-cyan-500/40'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 text-[8px] bg-black/75 text-slate-200 py-0.5 text-center font-medium truncate px-1">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Upload or Direct URL */}
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

              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload From Device</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Prompt Template */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Tested AI Prompt *
            </label>
            <textarea
              required
              rows={4}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              placeholder="e.g. Create a realistic 3D illusion of [GENDER] sitting on a throne with glowing wings and name [NAME]..."
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
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="1:1">1:1 Square (Instagram DP)</option>
                <option value="9:16">9:16 Vertical (Reels / Story)</option>
                <option value="3:4">3:4 Classic Portrait</option>
                <option value="16:9">16:9 Landscape (Desktop)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="3D Wings, Neon, DP"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish to Feed</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
