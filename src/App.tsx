/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  INITIAL_PROMPTS, 
  PromptItem, 
  CURRENT_USER_DEFAULT, 
  UserProfile, 
  CATEGORIES 
} from './data/prompts';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MasonryFeed } from './components/MasonryFeed';
import { ImageDetailModal } from './components/ImageDetailModal';
import { UploadModal } from './components/UploadModal';
import { NanoBananaStudioModal } from './components/NanoBananaStudioModal';
import { AuthModal } from './components/AuthModal';
import { CreatorLeagueModal } from './components/CreatorLeagueModal';
import { ProfileModal } from './components/ProfileModal';
import { StandaloneHtmlModal } from './components/StandaloneHtmlModal';
import { ThemeMode } from './components/ThemeSwitcher';
import { Sparkles, Trophy, PlusCircle, Flame, Filter, SlidersHorizontal, Check } from 'lucide-react';

export default function App() {
  // Theme state: dark (slate/navy default), night (pitch-black OLED), light (clean modern white)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptcare_theme') as ThemeMode;
      if (saved && (saved === 'dark' || saved === 'night' || saved === 'light')) {
        return saved;
      }
    }
    return 'dark';
  });

  // Current user state (persisted)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptcare_user');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return CURRENT_USER_DEFAULT;
  });

  // Prompts state (persisted)
  const [prompts, setPrompts] = useState<PromptItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptcare_feed_prompts');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_PROMPTS;
  });

  // Liked IDs set
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptcare_likes');
      if (saved) {
        try { return new Set(JSON.parse(saved)); } catch (e) {}
      }
    }
    return new Set<string>(['faymas-1', 'faymas-2']);
  });

  // Saved / Bookmarked IDs set
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptcare_saved');
      if (saved) {
        try { return new Set(JSON.parse(saved)); } catch (e) {}
      }
    }
    return new Set<string>(['faymas-1', 'faymas-4']);
  });

  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState<'feed' | 'league' | 'favorites'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [detailPrompt, setDetailPrompt] = useState<PromptItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioInitialPrompt, setStudioInitialPrompt] = useState('');
  const [studioInitialStyle, setStudioInitialStyle] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLeagueOpen, setIsLeagueOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExportHtmlOpen, setIsExportHtmlOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Sync theme to document element
  useEffect(() => {
    localStorage.setItem('promptcare_theme', theme);
    const root = document.documentElement;
    root.classList.remove('dark', 'night', 'light');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist data
  useEffect(() => {
    localStorage.setItem('promptcare_feed_prompts', JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem('promptcare_likes', JSON.stringify(Array.from(likedIds)));
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem('promptcare_saved', JSON.stringify(Array.from(savedIds)));
  }, [savedIds]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('promptcare_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('promptcare_user');
    }
  }, [currentUser]);

  // Like Toggle
  const handleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        triggerToast('Removed like');
      } else {
        next.add(id);
        triggerToast('Liked prompt! ❤️');
      }
      return next;
    });

    setPrompts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = likedIds.has(id);
        return {
          ...p,
          likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1
        };
      }
      return p;
    }));
  };

  // Save / Bookmark Toggle
  const handleToggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        triggerToast('Removed from saved collection');
      } else {
        next.add(id);
        triggerToast('Saved prompt to your collection! 🔖');
      }
      return next;
    });
  };

  // Add Prompt to Feed
  const handleAddPrompt = (newPrompt: PromptItem) => {
    setPrompts(prev => [newPrompt, ...prev]);
    setSelectedCategory('All');
    setActiveTab('feed');
  };

  // Delete Prompt
  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    triggerToast('Prompt deleted.');
  };

  // Try in Studio handler
  const handleTryInStudio = (prompt: PromptItem) => {
    setStudioInitialPrompt(prompt.promptTemplate);
    setStudioInitialStyle(prompt.category.toLowerCase());
    setIsStudioOpen(true);
  };

  // Filtered prompts
  const displayedPrompts = useMemo(() => {
    let list = prompts;

    // Tab filtering (Favorites)
    if (activeTab === 'favorites') {
      list = list.filter(p => likedIds.has(p.id) || savedIds.has(p.id));
    }

    // Category
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // Model
    if (selectedModel !== 'All') {
      list = list.filter(p => p.model.toLowerCase().includes(selectedModel.toLowerCase()));
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.promptTemplate.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.creator.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [prompts, activeTab, selectedCategory, selectedModel, searchQuery, likedIds, savedIds]);

  const appBg =
    theme === 'light'
      ? 'bg-[#F8FAFC] text-slate-900'
      : theme === 'night'
        ? 'bg-[#000000] text-zinc-100'
        : 'bg-[#0B0F19] text-slate-100';

  const categoryChipActive =
    theme === 'light'
      ? 'bg-slate-950 text-white shadow-md'
      : theme === 'night'
        ? 'bg-zinc-100 text-black shadow-md font-extrabold'
        : 'bg-white text-slate-950 shadow-md';

  const categoryChipInactive =
    theme === 'light'
      ? 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950 shadow-sm'
      : theme === 'night'
        ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white';

  const selectModelClass =
    theme === 'light'
      ? 'bg-white border-slate-200 text-slate-800 focus:ring-cyan-600'
      : theme === 'night'
        ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:ring-cyan-400'
        : 'bg-slate-900 border-slate-700 text-slate-300 focus:ring-cyan-500';

  return (
    <div className={`min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-200 ${appBg}`}>
      
      {/* Toast Notification */}
      <div 
        className={`fixed bottom-20 lg:bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold shadow-2xl ${
          toastMessage ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
        }`}
      >
        <Sparkles className="w-5 h-5 shrink-0 stroke-[2.5]" />
        <span className="text-xs sm:text-sm">{toastMessage}</span>
      </div>

      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenStudio={() => setIsStudioOpen(true)}
        onOpenLeague={() => setIsLeagueOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadNotificationsCount={2}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* App Body Container: Desktop Sidebar + Main Masonry Canvas */}
      <div className="max-w-[1700px] mx-auto flex">
        
        {/* Left Desktop Sidebar (Faymas / Pinterest Style) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab: any) => setActiveTab(tab)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          currentUser={currentUser}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenStudio={() => setIsStudioOpen(true)}
          onOpenLeague={() => setIsLeagueOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          theme={theme}
          onThemeChange={setTheme}
        />

        {/* Main Feed Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-12">
          
          {/* Category Filter Chips Bar (Scrollable on Mobile) */}
          <div className="flex items-center justify-between gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat && activeTab === 'feed';
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setActiveTab('feed'); }}
                    className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isActive ? categoryChipActive : categoryChipInactive
                    }`}
                  >
                    {cat === 'All' ? 'All Prompts' : `#${cat}`}
                  </button>
                );
              })}
            </div>

            {/* Model Filter Selector */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={`border text-xs font-semibold rounded-full px-3.5 py-1.5 focus:outline-none focus:ring-1 cursor-pointer transition-colors ${selectModelClass}`}
              >
                <option value="All">All AI Models</option>
                <option value="Nano Banana">🍌 Nano Banana AI</option>
                <option value="Bing Image Creator">Bing Image Creator</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="FLUX.1">FLUX.1</option>
                <option value="Stable Diffusion XL">Stable Diffusion XL</option>
              </select>

              <button
                onClick={() => setIsExportHtmlOpen(true)}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-mono transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white border-slate-200 text-cyan-800 hover:text-slate-950 shadow-sm'
                    : theme === 'night'
                      ? 'bg-zinc-900 border-zinc-800 text-cyan-400 hover:text-white'
                      : 'bg-slate-900 border-slate-700 text-cyan-400 hover:text-white'
                }`}
                title="Download Single-File HTML"
              >
                HTML Code
              </button>
            </div>
          </div>

          {/* Active View Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h1 className={`text-lg sm:text-xl font-extrabold ${
                theme === 'light' ? 'text-slate-950' : 'text-white'
              }`}>
                {activeTab === 'favorites' ? 'Saved Collection' : selectedCategory === 'All' ? 'Trending Community Prompts' : `#${selectedCategory} Prompts`}
              </h1>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold border ${
                theme === 'light'
                  ? 'bg-slate-100 text-cyan-800 border-slate-200'
                  : theme === 'night'
                    ? 'bg-zinc-900 text-cyan-400 border-zinc-800'
                    : 'bg-slate-800 text-cyan-400 border-slate-700'
              }`}>
                {displayedPrompts.length}
              </span>
            </div>

            {(selectedCategory !== 'All' || selectedModel !== 'All' || searchQuery || activeTab !== 'feed') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedModel('All');
                  setSearchQuery('');
                  setActiveTab('feed');
                }}
                className={`text-xs underline font-semibold transition-colors cursor-pointer ${
                  theme === 'light' ? 'text-cyan-700 hover:text-cyan-900' : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Pinterest-Style Masonry Image Feed */}
          {displayedPrompts.length > 0 ? (
            <MasonryFeed
              prompts={displayedPrompts}
              onOpenDetails={(p) => setDetailPrompt(p)}
              onLike={handleLike}
              likedIds={likedIds}
              onTriggerToast={triggerToast}
              onTryInStudio={handleTryInStudio}
              onDeletePrompt={handleDeletePrompt}
              currentUser={currentUser}
              theme={theme}
            />
          ) : (
            <div className={`py-24 text-center rounded-3xl border transition-colors ${
              theme === 'light'
                ? 'bg-white border-slate-200 shadow-sm'
                : theme === 'night'
                  ? 'bg-zinc-950 border-zinc-900 shadow-black'
                  : 'bg-slate-900/40 border-slate-800/80'
            }`}>
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 flex items-center justify-center mx-auto mb-4 text-2xl border border-amber-400/30">
                🍌
              </div>
              <h3 className={`text-lg font-bold mb-1 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                No matching prompts in this feed
              </h3>
              <p className={`text-xs max-w-sm mx-auto mb-6 ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Try searching another prompt keyword or generate one directly in Nano Banana AI Studio!
              </p>
              <button
                onClick={() => setIsStudioOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                Open Nano Banana Studio
              </button>
            </div>
          )}

        </main>

      </div>

      {/* Mobile Bottom Navigation Bar (5 Icons) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab: any) => setActiveTab(tab)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenStudio={() => setIsStudioOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        theme={theme}
      />

      {/* Interactive Prompt Detail Modal */}
      <ImageDetailModal
        prompt={detailPrompt}
        onClose={() => setDetailPrompt(null)}
        onLike={handleLike}
        isLiked={detailPrompt ? likedIds.has(detailPrompt.id) : false}
        onToggleSave={handleToggleSave}
        isSaved={detailPrompt ? savedIds.has(detailPrompt.id) : false}
        onTriggerToast={triggerToast}
        onTryInStudio={handleTryInStudio}
        currentUser={currentUser}
      />

      {/* Community Upload Modal (+) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleAddPrompt}
        onTriggerToast={triggerToast}
        currentUser={currentUser}
      />

      {/* In-App Nano Banana AI Studio Modal */}
      <NanoBananaStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        onPublishToFeed={handleAddPrompt}
        onTriggerToast={triggerToast}
        currentUser={currentUser}
        initialPrompt={studioInitialPrompt}
        initialStyle={studioInitialStyle}
        theme={theme}
      />

      {/* User Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        onTriggerToast={triggerToast}
      />

      {/* Creator League Leaderboard Modal */}
      <CreatorLeagueModal
        isOpen={isLeagueOpen}
        onClose={() => setIsLeagueOpen(false)}
        currentUser={currentUser}
        onTriggerToast={triggerToast}
      />

      {/* Profile Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          prompts={prompts}
          likedIds={likedIds}
          onSelectPrompt={(p) => setDetailPrompt(p)}
          onLogout={() => {
            setCurrentUser(null);
            triggerToast('Logged out.');
            setIsProfileOpen(false);
          }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onTriggerToast={triggerToast}
        />
      )}

      {/* Standalone Single-File HTML Exporter */}
      <StandaloneHtmlModal
        isOpen={isExportHtmlOpen}
        onClose={() => setIsExportHtmlOpen(false)}
        onTriggerToast={triggerToast}
      />

    </div>
  );
}
