import React from 'react';
import { INITIAL_AI_TOOLS, AIToolItem } from '../data/prompts';
import { ExternalLink, Star, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface ToolsGridProps {
  onTriggerToast: (msg: string) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ onTriggerToast }) => {
  return (
    <section id="tools-section" className="py-16 bg-slate-950/70 border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-cyan-400 tracking-wider font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>AI Tools Discovery (faymas.in ecosystem)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Trending AI Tools & Resources of the Week
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Curated, battle-tested AI software, developer platforms, and creative studios to accelerate your output.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">8 Verified Software Tools</span>
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INITIAL_AI_TOOLS.map((tool: AIToolItem) => (
            <div
              key={tool.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 hover:-translate-y-0.5 flex flex-col justify-between group"
            >
              <div>
                {/* Badge & Rating */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                    tool.pricing === 'Free' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    tool.pricing === 'Open Source' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                    tool.pricing === 'Freemium' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {tool.pricing}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{tool.rating}</span>
                  </div>
                </div>

                {/* Name & Tagline */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">
                  {tool.name}
                </h3>
                <div className="text-[11px] font-medium text-slate-400 mb-2 font-mono">
                  {tool.category}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>

              {/* Direct visit button */}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:border-transparent"
              >
                <span>Launch Tool</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
