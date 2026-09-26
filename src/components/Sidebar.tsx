import React from 'react';
import { 
  Home, 
  Compass, 
  Trophy, 
  Heart, 
  Sparkles, 
  PlusCircle, 
  User, 
  Tag, 
  Flame, 
  Layers,
  Wand2,
  ExternalLink
} from 'lucide-react';
import { UserProfile, CATEGORIES } from '../data/prompts';
import { ThemeSwitcher, ThemeMode } from './ThemeSwitcher';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  currentUser: UserProfile | null;
  onOpenUpload: () => void;
  onOpenStudio: () => void;
  onOpenLeague: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  selectedCategory,
  onSelectCategory,
  currentUser,
  onOpenUpload,
  onOpenStudio,
  onOpenLeague,
  onOpenAuth,
  onOpenProfile,
  theme,
  onThemeChange,
}) => {
  const sidebarBg = 
    theme === 'light'
      ? 'border-r border-slate-200 bg-white/95 text-slate-800'
      : theme === 'night'
        ? 'border-r border-zinc-800 bg-black/95 text-zinc-200'
        : 'border-r border-slate-800/80 bg-[#0B0F19]/95 text-slate-200';

  const navItemClass = (isActive: boolean) => {
    if (isActive) {
      return 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold';
    }
    if (theme === 'light') {
      return 'text-slate-600 hover:bg-slate-100 hover:text-slate-950';
    }
    if (theme === 'night') {
      return 'text-zinc-400 hover:bg-zinc-900 hover:text-white';
    }
    return 'text-slate-300 hover:bg-slate-900 hover:text-white';
  };

  const tagItemClass = (isSelected: boolean) => {
    if (isSelected) {
      if (theme === 'light') {
        return 'bg-slate-200/90 text-cyan-800 font-bold border-l-2 border-cyan-600';
      }
      return 'bg-slate-800 text-cyan-400 font-bold border-l-2 border-cyan-400';
    }
    if (theme === 'light') {
      return 'text-slate-500 hover:bg-slate-100 hover:text-slate-900';
    }
    if (theme === 'night') {
      return 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200';
    }
    return 'text-slate-400 hover:bg-slate-900 hover:text-slate-200';
  };

  return (
    <aside className={`hidden lg:flex flex-col justify-between w-64 shrink-0 min-h-[calc(100vh-4rem)] p-4 sticky top-16 select-none transition-colors duration-200 ${sidebarBg}`}>
      
      {/* Top Navigation Links */}
      <div className="space-y-6">
        
        {/* Main Nav Items */}
        <div className="space-y-1">
          <button
            onClick={() => { onSelectTab('feed'); onSelectCategory('All'); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${navItemClass(activeTab === 'feed' && selectedCategory === 'All')}`}
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Discover Feed</span>
          </button>

          <button
            onClick={onOpenStudio}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm group ${
              theme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-transparent text-amber-300 border border-amber-400/30 hover:border-amber-400 hover:bg-amber-400/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base group-hover:scale-110 transition-transform">🍌</span>
              <span>Nano Banana Studio</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold uppercase">
              AI Gen
            </span>
          </button>

          <button
            onClick={onOpenLeague}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${navItemClass(activeTab === 'league')}`}
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Creator League</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
              theme === 'light'
                ? 'bg-slate-100 text-amber-700 border-slate-200'
                : 'bg-slate-800 text-amber-400 border-slate-700'
            }`}>
              Top #10
            </span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) onOpenAuth();
              else onSelectTab('favorites');
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${navItemClass(activeTab === 'favorites')}`}
          >
            <Heart className="w-4 h-4 text-rose-400 stroke-[2.5]" />
            <span>Saved Prompts</span>
          </button>
        </div>

        {/* Primary "+ Create / Upload" Button */}
        <div>
          <button
            onClick={onOpenUpload}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[3]" />
            <span>+ Upload Prompt</span>
          </button>
        </div>

        {/* Categories / Tag Feeds */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3.5 mb-2.5 flex items-center justify-between">
            <span>Explore #Tags</span>
            <Tag className="w-3 h-3 text-slate-500" />
          </div>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    onSelectTab('feed');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${tagItemClass(isSelected)}`}
                >
                  <span>#{cat}</span>
                  {cat === 'Viral Bing' && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono">hot</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Section: Theme Switcher & User Account */}
      <div className={`pt-4 border-t space-y-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800/80'}`}>
        
        {/* Theme Switcher Widget in Sidebar */}
        <ThemeSwitcher
          theme={theme}
          onThemeChange={onThemeChange}
          variant="sidebar"
        />

        {/* User Account Bar */}
        {currentUser ? (
          <div 
            onClick={onOpenProfile}
            className={`flex items-center gap-3 p-2.5 rounded-2xl transition-colors cursor-pointer group ${
              theme === 'light' ? 'hover:bg-slate-100' : theme === 'night' ? 'hover:bg-zinc-900' : 'hover:bg-slate-900'
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-cyan-500/50"
            />
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-bold truncate ${
                theme === 'light' ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-400'
              }`}>
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">
                {currentUser.handle} · Rank #{currentUser.rank}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200'
                : theme === 'night'
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>

    </aside>
  );
};
