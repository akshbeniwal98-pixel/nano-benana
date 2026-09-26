import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Sparkles, Check, ChevronDown } from 'lucide-react';

export type ThemeMode = 'dark' | 'night' | 'light';

interface ThemeSwitcherProps {
  theme: ThemeMode;
  onThemeChange: (newTheme: ThemeMode) => void;
  variant?: 'compact' | 'segmented' | 'sidebar';
}

export const THEME_CONFIG = {
  dark: {
    id: 'dark' as ThemeMode,
    label: 'Dark Mode',
    shortLabel: 'Dark',
    desc: 'Deep slate & navy cyber look',
    icon: Moon,
    iconColor: 'text-cyan-400',
    dotBg: 'bg-slate-800',
  },
  night: {
    id: 'night' as ThemeMode,
    label: 'Night Mode (OLED)',
    shortLabel: 'Night',
    desc: 'Pitch-black OLED high contrast',
    icon: Sparkles,
    iconColor: 'text-amber-300',
    dotBg: 'bg-black',
  },
  light: {
    id: 'light' as ThemeMode,
    label: 'Light Mode',
    shortLabel: 'Light',
    desc: 'Clean & crisp daytime view',
    icon: Sun,
    iconColor: 'text-amber-500',
    dotBg: 'bg-white',
  },
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  theme,
  onThemeChange,
  variant = 'compact',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const CurrentIcon = THEME_CONFIG[theme].icon;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Sidebar Expanded Mode
  if (variant === 'sidebar') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className={`text-[11px] font-mono uppercase tracking-wider font-bold ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Appearance
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
            theme === 'night' 
              ? 'bg-zinc-800 text-amber-300 border border-zinc-700' 
              : theme === 'dark' 
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'bg-slate-200 text-slate-800 border border-slate-300'
          }`}>
            {THEME_CONFIG[theme].shortLabel}
          </span>
        </div>

        <div className={`grid grid-cols-3 p-1 rounded-2xl border transition-colors ${
          theme === 'light'
            ? 'bg-slate-100 border-slate-200'
            : theme === 'night'
              ? 'bg-zinc-950 border-zinc-800'
              : 'bg-slate-900 border-slate-800'
        }`}>
          {(['dark', 'night', 'light'] as ThemeMode[]).map((mode) => {
            const item = THEME_CONFIG[mode];
            const Icon = item.icon;
            const isSelected = theme === mode;

            return (
              <button
                key={mode}
                onClick={() => onThemeChange(mode)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? theme === 'light'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : theme === 'night'
                        ? 'bg-zinc-800 text-white shadow-md shadow-black'
                        : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title={item.desc}
              >
                <Icon className={`w-3.5 h-3.5 mb-1 ${isSelected ? '' : item.iconColor}`} />
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Segmented Pill Mode
  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center p-1 rounded-full border transition-colors ${
        theme === 'light'
          ? 'bg-slate-100 border-slate-200'
          : theme === 'night'
            ? 'bg-zinc-900 border-zinc-800'
            : 'bg-slate-900 border-slate-800'
      }`}>
        {(['dark', 'night', 'light'] as ThemeMode[]).map((mode) => {
          const item = THEME_CONFIG[mode];
          const Icon = item.icon;
          const isSelected = theme === mode;

          return (
            <button
              key={mode}
              onClick={() => onThemeChange(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? theme === 'light'
                    ? 'bg-white text-slate-950 shadow-sm font-bold'
                    : theme === 'night'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'bg-cyan-500 text-slate-950 font-bold'
                  : theme === 'light'
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
              }`}
              title={item.desc}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 3. Compact Dropdown Mode (Ideal for Header)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
            : theme === 'night'
              ? 'bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700'
              : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
        }`}
        title={`Theme: ${THEME_CONFIG[theme].label}`}
      >
        <CurrentIcon className={`w-4 h-4 ${THEME_CONFIG[theme].iconColor}`} />
        <span className="hidden sm:inline">{THEME_CONFIG[theme].shortLabel}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-52 rounded-2xl border shadow-2xl p-2 z-50 backdrop-blur-xl transition-all ${
          theme === 'light'
            ? 'bg-white/95 border-slate-200 text-slate-900'
            : theme === 'night'
              ? 'bg-black/95 border-zinc-800 text-white shadow-black'
              : 'bg-slate-900/95 border-slate-800 text-white'
        }`}>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 py-1 mb-1">
            Select Theme
          </div>

          {(['dark', 'night', 'light'] as ThemeMode[]).map((mode) => {
            const item = THEME_CONFIG[mode];
            const Icon = item.icon;
            const isSelected = theme === mode;

            return (
              <button
                key={mode}
                onClick={() => {
                  onThemeChange(mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? theme === 'light'
                      ? 'bg-slate-100 text-slate-950 font-bold'
                      : theme === 'night'
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'bg-slate-800 text-cyan-400 font-bold'
                    : theme === 'light'
                      ? 'hover:bg-slate-50 text-slate-700'
                      : 'hover:bg-slate-800/70 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  <div className="text-left">
                    <div className="leading-none">{item.label}</div>
                    <div className="text-[9px] text-slate-500 font-normal mt-0.5">{item.desc}</div>
                  </div>
                </div>
                {isSelected && (
                  <Check className={`w-4 h-4 ${
                    theme === 'light' ? 'text-slate-900' : 'text-cyan-400'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
