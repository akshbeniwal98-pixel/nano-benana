import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Sun, 
  Moon, 
  PlusCircle, 
  Users, 
  FileCode, 
  Menu, 
  X,
  ExternalLink,
  Flame,
  Wrench
} from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSubmit: () => void;
  onOpenCommunity: () => void;
  onOpenExportHtml: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  onOpenSubmit,
  onOpenCommunity,
  onOpenExportHtml,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg badge-glow transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                PromptCare
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-bold">
                .online
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onScrollToSection('prompts-section')} 
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            AI Prompts
          </button>
          <button 
            onClick={() => onScrollToSection('categories-section')} 
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Categories
          </button>
          <button 
            onClick={() => onScrollToSection('tools-section')} 
            className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            AI Tools
          </button>
          <button 
            onClick={() => onScrollToSection('prompts-section')} 
            className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Trending
          </button>
          <button 
            onClick={onOpenSubmit} 
            className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Submit Prompt
          </button>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Export Single-File HTML CTA */}
          <button
            onClick={onOpenExportHtml}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
            title="Download or copy the complete single HTML file"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Single-File</span> HTML
          </button>

          {/* Community Modal Button */}
          <button
            onClick={onOpenCommunity}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            Community
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-500" />}
          </button>

          {/* Primary Submit CTA */}
          <button
            onClick={onOpenSubmit}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Prompt</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0B0F19] px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <button
              onClick={() => { onScrollToSection('prompts-section'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              AI Prompts
            </button>
            <button
              onClick={() => { onScrollToSection('categories-section'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Categories
            </button>
            <button
              onClick={() => { onScrollToSection('tools-section'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center justify-between"
            >
              <span>AI Tools Directory</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400">faymas.in style</span>
            </button>
            <button
              onClick={() => { onOpenSubmit(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 font-semibold flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Your Prompt
            </button>
            <button
              onClick={() => { onOpenExportHtml(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-300 flex items-center gap-2"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              Get Standalone HTML File
            </button>
            <button
              onClick={() => { onOpenCommunity(); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 text-slate-300 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-400" />
              Join Creator Community
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
