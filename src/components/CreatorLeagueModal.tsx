import React from 'react';
import { CreatorInfo, INITIAL_CREATORS, UserProfile } from '../data/prompts';
import { X, Trophy, Medal, Star, Flame, Sparkles, UserCheck } from 'lucide-react';

interface CreatorLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onTriggerToast: (msg: string) => void;
}

export const CreatorLeagueModal: React.FC<CreatorLeagueModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTriggerToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            Season 3 Leaderboard
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-white mb-1">
          PromptCare Creator League
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Top prompt engineers ranked by community copies, upvotes, and studio generations on promptcare.online.
        </p>

        {/* Current User Standing Banner */}
        {currentUser && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-cyan-400"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentUser.name} (You)</span>
                  <span className="text-[10px] px-1.5 rounded bg-cyan-400 text-slate-950 font-bold">Your Rank</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {currentUser.points.toLocaleString()} Creator Points
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-cyan-400 font-mono">#{currentUser.rank}</div>
              <div className="text-[10px] text-slate-400">Global Rank</div>
            </div>
          </div>
        )}

        {/* Top 5 Leaderboard List */}
        <div className="space-y-2.5">
          {INITIAL_CREATORS.map((creator, index) => {
            let rankColor = 'text-slate-400';
            let rankBadge = `#${index + 1}`;
            if (index === 0) { rankColor = 'text-amber-400'; rankBadge = '🥇 #1'; }
            if (index === 1) { rankColor = 'text-slate-300'; rankBadge = '🥈 #2'; }
            if (index === 2) { rankColor = 'text-amber-600'; rankBadge = '🥉 #3'; }

            return (
              <div
                key={creator.handle}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 font-mono text-sm font-extrabold ${rankColor}`}>
                    {rankBadge}
                  </span>

                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  />

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{creator.name}</span>
                      {creator.badge && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-cyan-400">
                          {creator.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {creator.handle}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-amber-300 font-mono">
                    {creator.points?.toLocaleString()} pts
                  </div>
                  <div className="text-[9px] text-slate-500">
                    24k+ copies
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 mb-3">
            Earn +50 points when someone copies your prompt, and +100 points for Studio generations!
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Leaderboard
          </button>
        </div>

      </div>
    </div>
  );
};
