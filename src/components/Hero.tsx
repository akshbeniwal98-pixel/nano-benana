import React from 'react';
import { Search, X, Sparkles, Layers, Terminal, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickFilter: (tag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onQuickFilter,
}) => {
  return (
    <section className="relative pt-16 pb-12 overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-[#0e1526] via-[#0B0F19] to-[#0B0F19]">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/15 via-blue-600/5 to-transparent pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Curated Prompts for ChatGPT, Midjourney, Claude & Gemini</span>
        </div>

        {/* Catchy Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Supercharge Your AI Workflow with <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
            Curated Prompts & Tools
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
          Stop struggling with generic AI replies. Access tested, production-grade prompts with customizable variables, engineering cheat-sheets, and vetted tool directories.
        </p>

        {/* Central Search Bar */}
        <div className="max-w-2xl mx-auto relative mb-6">
          <div className="relative flex items-center shadow-2xl rounded-2xl group">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prompts by keyword, model, or use-case (e.g. SEO, Midjourney, Code Review)..."
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base shadow-inner transition-all"
            />

            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700">
                / key
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-10">
          <span className="font-semibold text-slate-400">Popular:</span>
          {['SEO', 'Coding', 'Midjourney', 'Marketing', 'Claude 3.7', 'Copywriting', 'Architecture'].map((tag) => (
            <button
              key={tag}
              onClick={() => onQuickFilter(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 hover:text-cyan-300 text-slate-300 border border-slate-800 transition-all cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Live Metric Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/80 text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <div className="text-2xl font-bold text-white font-mono">1,200+</div>
            <div className="text-xs text-slate-400 mt-0.5">Tested Prompts</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <div className="text-2xl font-bold text-white font-mono">45+</div>
            <div className="text-xs text-slate-400 mt-0.5">Curated AI Tools</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <div className="text-2xl font-bold text-white font-mono">280k+</div>
            <div className="text-xs text-slate-400 mt-0.5">Prompt Copies</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <div className="text-2xl font-bold text-cyan-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Free & Open</div>
          </div>
        </div>

      </div>
    </section>
  );
};
