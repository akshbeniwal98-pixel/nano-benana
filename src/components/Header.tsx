import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Trophy, 
  Bell, 
  PlusCircle, 
  User, 
  SlidersHorizontal, 
  Flame,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../data/prompts';
import { ThemeSwitcher, ThemeMode } from './ThemeSwitcher';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenUpload: () => void;
  onOpenStudio: () => void;
  onOpenLeague: () => void;
  onOpenProfile: () => void;
  unreadNotificationsCount: number;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenAuth,
  onOpenUpload,
  onOpenStudio,
  onOpenLeague,
  onOpenProfile,
  unreadNotificationsCount,
  theme,
  onThemeChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: '🏆 Creator League Update', text: 'Your 3D Wings prompt crossed 5,000 copies! Rank #4 maintained.', time: '10m ago' },
    { id: 2, title: '✨ Trending Alert', text: '@elena_cinema published "Cinematic 35mm Vintage Portrait".', time: '1h ago' },
    { id: 3, title: '🍌 Studio Feature', text: 'Nano Banana v2.4 model released with 9:16 Reels support.', time: '1d ago' },
  ];

  const headerBgClass = 
    theme === 'light'
      ? 'border-b border-slate-200 bg-white/90 text-slate-900'
      : theme === 'night'
        ? 'border-b border-zinc-800 bg-black/90 text-white'
        : 'border-b border-slate-800/80 bg-[#0B0F19]/90 text-slate-100';

  const searchBgClass =
    theme === 'light'
      ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
      : theme === 'night'
        ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-cyan-400'
        : 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-500';

  const buttonSecondaryClass =
    theme === 'light'
      ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-950'
      : theme === 'night'
        ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white';

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-colors duration-200 ${headerBgClass}`}>
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg badge-glow transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-extrabold tracking-tight transition-colors ${
                theme === 'light' ? 'text-slate-950 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'
              }`}>
                PromptCare
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded font-bold border ${
                theme === 'light' 
                  ? 'bg-cyan-100 text-cyan-800 border-cyan-200' 
                  : 'bg-cyan-950/90 text-cyan-400 border-cyan-800/80'
              }`}>
                .online
              </span>
            </div>
          </a>
        </div>

        {/* Central Search Bar (Pinterest / Faymas style) */}
        <div className="flex-1 max-w-2xl mx-2 sm:mx-6">
          <div className="relative flex items-center group">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
              theme === 'light' ? 'text-slate-400 group-focus-within:text-cyan-600' : 'text-slate-400 group-focus-within:text-cyan-400'
            }`}>
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search AI portraits, 3D wings, prompt ideas, models..."
              className={`w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${searchBgClass}`}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation & Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Theme Switcher Toggle (Dark / Night / Light) */}
          <ThemeSwitcher 
            theme={theme} 
            onThemeChange={onThemeChange} 
            variant="compact" 
          />

          {/* Nano Banana In-App AI Studio Button */}
          <button
            onClick={onOpenStudio}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
              theme === 'light'
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:border-amber-400'
            }`}
            title="Open In-App Nano Banana Image Studio"
          >
            <span className="text-sm">🍌</span>
            <span>Studio</span>
          </button>

          {/* Creator League Trophy */}
          <button
            onClick={onOpenLeague}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${buttonSecondaryClass}`}
            title="Creator League Leaderboard"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline text-xs font-semibold">League</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border transition-colors relative cursor-pointer ${buttonSecondaryClass}`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-bold flex items-center justify-center shadow-md animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div 
                className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl p-4 z-50 transition-all ${
                  theme === 'light'
                    ? 'bg-white border-slate-200 text-slate-900'
                    : theme === 'night'
                      ? 'bg-zinc-950 border-zinc-800 text-white shadow-black'
                      : 'bg-slate-900 border-slate-700/80 text-slate-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`flex items-center justify-between mb-3 border-b pb-2 ${
                  theme === 'light' ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <span className="text-xs font-bold uppercase tracking-wider">Notifications</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2.5">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl border transition-colors ${
                        theme === 'light'
                          ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          : theme === 'night'
                            ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                            : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${theme === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className={`text-[11px] leading-snug ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* + Upload Prompt CTA */}
          <button
            onClick={onOpenUpload}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Upload</span>
          </button>

          {/* User Profile / Auth State */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className={`flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-full border transition-all cursor-pointer group ${buttonSecondaryClass}`}
              title="View your creator profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-cyan-500/40"
              />
              <span className={`text-xs font-semibold max-w-[80px] truncate hidden md:inline ${
                theme === 'light' ? 'text-slate-800 group-hover:text-cyan-600' : 'text-slate-200 group-hover:text-cyan-400'
              }`}>
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Log In
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
