import React from 'react';
import { Home, Search, PlusCircle, Sparkles, User, Trophy, Heart } from 'lucide-react';
import { UserProfile } from '../data/prompts';
import { ThemeMode } from './ThemeSwitcher';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenStudio: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  currentUser: UserProfile | null;
  theme: ThemeMode;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenUpload,
  onOpenStudio,
  onOpenProfile,
  onOpenAuth,
  currentUser,
  theme,
}) => {
  const navBg = 
    theme === 'light'
      ? 'bg-white/95 border-t border-slate-200 shadow-lg text-slate-800'
      : theme === 'night'
        ? 'bg-black/95 border-t border-zinc-800 text-white shadow-black'
        : 'bg-[#0B0F19]/95 border-t border-slate-800/90 text-slate-100';

  const inactiveText =
    theme === 'light'
      ? 'text-slate-500 hover:text-slate-900'
      : 'text-slate-400 hover:text-white';

  return (
    <div className={`lg:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl py-2 px-3 transition-colors duration-200 ${navBg}`}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Home Feed */}
        <button
          onClick={() => onSelectTab('feed')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
            activeTab === 'feed' 
              ? theme === 'light' ? 'text-cyan-700 font-bold' : 'text-cyan-400 font-bold'
              : inactiveText
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Feed</span>
        </button>

        {/* 2. Explore / Search */}
        <button
          onClick={() => {
            const input = document.querySelector('header input') as HTMLInputElement;
            if (input) {
              input.focus();
            }
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${inactiveText}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </button>

        {/* 3. + Center Action Button (Create / Upload) */}
        <button
          onClick={onOpenUpload}
          className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-transform active:scale-95 cursor-pointer"
          title="Upload or create prompt"
        >
          <PlusCircle className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* 4. Nano Banana Studio */}
        <button
          onClick={onOpenStudio}
          className="flex flex-col items-center gap-1 p-1.5 text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <span className="text-xl leading-none">🍌</span>
          <span className="text-[10px] font-bold">Studio</span>
        </button>

        {/* 5. Profile / Auth */}
        <button
          onClick={() => {
            if (currentUser) onOpenProfile();
            else onOpenAuth();
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${inactiveText}`}
        >
          {currentUser ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover border border-cyan-400"
            />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px]">{currentUser ? 'Profile' : 'Log In'}</span>
        </button>

      </div>
    </div>
  );
};
