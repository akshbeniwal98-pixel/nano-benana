import React, { useState } from 'react';
import { UserProfile, PromptItem } from '../data/prompts';
import { X, Heart, Sparkles, Trophy, LogOut, Bookmark, PlusCircle, ExternalLink } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  prompts: PromptItem[];
  likedIds: Set<string>;
  onSelectPrompt: (p: PromptItem) => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onTriggerToast: (msg: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  prompts,
  likedIds,
  onSelectPrompt,
  onLogout,
  onOpenUpload,
  onTriggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<'uploads' | 'saved'>('uploads');

  if (!isOpen) return null;

  // Filter prompts uploaded by this user or saved
  const userUploads = prompts.filter(p => 
    p.creator.name === currentUser.name || p.id.startsWith('user-')
  );

  const savedPrompts = prompts.filter(p => likedIds.has(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative text-slate-100 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 pb-6 border-b border-slate-800 text-center sm:text-left">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400 shadow-lg"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <div>
                <h3 className="text-xl font-extrabold text-white">{currentUser.name}</h3>
                <div className="text-xs font-mono text-cyan-400">{currentUser.handle}</div>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
              {currentUser.bio}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs">
              <div>
                <span className="font-bold text-white font-mono">{userUploads.length}</span>{' '}
                <span className="text-slate-500">Prompts</span>
              </div>
              <span className="text-slate-700">·</span>
              <div>
                <span className="font-bold text-white font-mono">{savedPrompts.length}</span>{' '}
                <span className="text-slate-500">Saved</span>
              </div>
              <span className="text-slate-700">·</span>
              <div>
                <span className="font-bold text-amber-400 font-mono">#{currentUser.rank}</span>{' '}
                <span className="text-slate-500">in League</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'uploads'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Published Prompts ({userUploads.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved Favorites ({savedPrompts.length})
          </button>
        </div>

        {/* List of Prompts */}
        <div className="flex-1 max-h-72 overflow-y-auto space-y-2.5 pr-1">
          {activeTab === 'uploads' ? (
            userUploads.length > 0 ? (
              userUploads.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { onClose(); onSelectPrompt(p); }}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{p.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{p.model} · {p.category}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono shrink-0">❤️ {p.likes}</span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                You haven't posted any prompts yet.{' '}
                <button onClick={() => { onClose(); onOpenUpload(); }} className="text-cyan-400 font-bold underline">
                  Post your first prompt!
                </button>
              </div>
            )
          ) : (
            savedPrompts.length > 0 ? (
              savedPrompts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { onClose(); onSelectPrompt(p); }}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{p.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">by {p.creator.name}</div>
                    </div>
                  </div>
                  <span className="text-xs text-rose-400 font-mono shrink-0">❤️ Saved</span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                No saved prompts yet. Click ❤️ on any card in the feed!
              </div>
            )
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => { onClose(); onOpenUpload(); }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Prompt</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
