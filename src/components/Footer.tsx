import React from 'react';
import { Sparkles, Heart, ExternalLink, Github, Twitter, MessageSquare, Linkedin } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onOpenSubmit: () => void;
  onOpenCommunity: () => void;
  onOpenExportHtml: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
  onOpenSubmit,
  onOpenCommunity,
  onOpenExportHtml,
}) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-16 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-white">PromptCare</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">.online</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Curated prompt engineering and AI discovery directory inspired by faymas.in. Tested templates for ChatGPT-4o, Claude 3.7, Midjourney v6, and FLUX.1.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-cyan-400 hover:bg-slate-800 transition-colors" title="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-indigo-400 hover:bg-slate-800 transition-colors" title="Discord">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-blue-400 hover:bg-slate-800 transition-colors" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200 mb-4">
              Explore Prompts
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onScrollToSection('prompts-section')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  Coding & AppSec Audits
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('prompts-section')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  Midjourney Photorealism
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('prompts-section')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  SaaS CRO Copywriting
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('prompts-section')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  LinkedIn Growth Carousels
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('prompts-section')} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  Academic Literature Synthesizer
                </button>
              </li>
            </ul>
          </div>

          {/* AI Tools & Resources */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200 mb-4">
              Featured Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Cursor AI Editor</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Claude 3.7 Sonnet</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://midjourney.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Midjourney v6.1</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://blackforestlabs.ai" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>FLUX.1 Open Weights</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Perplexity AI Search</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Platform & Community */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={onOpenSubmit} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  Submit Prompt Template
                </button>
              </li>
              <li>
                <button onClick={onOpenExportHtml} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  Download Single-File HTML
                </button>
              </li>
              <li>
                <button onClick={onOpenCommunity} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                  Creator Discord & Community
                </button>
              </li>
              <li>
                <span className="text-slate-500">API Documentation (Coming soon)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 promptcare.online. All prompts are community-verified. Inspired by faymas.in.
          </div>
          <div className="text-center md:text-right max-w-md text-[11px] leading-relaxed">
            PromptCare provides tested prompt frameworks. Outputs depend on LLM parameters, temperature, and context length.
          </div>
        </div>

      </div>
    </footer>
  );
};
