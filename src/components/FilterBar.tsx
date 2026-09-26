import React from 'react';
import { CATEGORIES, AI_MODELS } from '../data/prompts';
import { SlidersHorizontal, Sparkles, Flame, ThumbsUp, Copy, Check } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  sortMode: 'trending' | 'likes' | 'copies';
  onSelectSort: (sort: 'trending' | 'likes' | 'copies') => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedModel,
  onSelectModel,
  sortMode,
  onSelectSort,
  totalCount,
}) => {
  return (
    <section id="categories-section" className="py-4 border-b border-slate-800/80 bg-slate-950/60 sticky top-16 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Horizontal scrollable category filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Model Filter & Sort Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            
            {/* Model Select */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200 rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                {AI_MODELS.map((model: string) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortMode}
                onChange={(e) => onSelectSort(e.target.value as any)}
                className="appearance-none bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200 rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="trending">Trending First</option>
                <option value="likes">Most Liked</option>
                <option value="copies">Most Copied</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Counter pill */}
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-1 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
              {totalCount} prompts
            </span>

          </div>

        </div>
      </div>
    </section>
  );
};
