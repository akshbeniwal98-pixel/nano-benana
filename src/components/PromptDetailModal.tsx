import React, { useState, useEffect } from 'react';
import { PromptItem } from '../data/prompts';
import { X, Copy, Check, Sliders, ExternalLink, Lightbulb, BookOpen, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface PromptDetailModalProps {
  prompt: PromptItem | null;
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  onClose,
  onTriggerToast,
}) => {
  if (!prompt) return null;

  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  useEffect(() => {
    if (prompt.variables && Array.isArray(prompt.variables)) {
      const initial: Record<string, string> = {};
      prompt.variables.forEach((v: any) => {
        initial[v.key] = v.defaultValue;
      });
      setVariableValues(initial);
    }
  }, [prompt]);

  const computedPrompt = React.useMemo(() => {
    let result = prompt.promptTemplate;
    Object.keys(variableValues).forEach(key => {
      const val = variableValues[key] || `[${key}]`;
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      result = result.replace(regex, val);
    });
    return result;
  }, [prompt.promptTemplate, variableValues]);

  const handleCopy = () => {
    navigator.clipboard.writeText(computedPrompt).then(() => {
      setCopied(true);
      onTriggerToast('Prompt copied to clipboard! Ready to generate.');
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleCopyNegative = () => {
    if (!prompt.negativePrompt) return;
    navigator.clipboard.writeText(prompt.negativePrompt).then(() => {
      setCopiedNegative(true);
      onTriggerToast('Negative prompt copied!');
      setTimeout(() => setCopiedNegative(false), 2000);
    });
  };

  const getToolUrl = (model: string) => {
    if (model.includes('Bing')) return 'https://www.bing.com/images/create';
    if (model.includes('Midjourney')) return 'https://midjourney.com';
    if (model.includes('FLUX')) return 'https://blackforestlabs.ai';
    if (model.includes('Claude')) return 'https://claude.ai';
    if (model.includes('Kling')) return 'https://klingai.com';
    return 'https://chatgpt.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div>
          {/* Visual Banner if present */}
          {prompt.imageUrl && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 bg-slate-950 border border-slate-800">
              <img 
                src={prompt.imageUrl} 
                alt={prompt.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 shadow-md">
                    {prompt.model}
                  </span>
                  {prompt.aspectRatio && (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold bg-black/70 backdrop-blur-md text-white border border-white/20">
                      Aspect Ratio: {prompt.aspectRatio}
                    </span>
                  )}
                </div>

                <a
                  href={getToolUrl(prompt.model)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md"
                >
                  <span>Open in {prompt.model.split(' ')[0]}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Title & Metadata */}
          <div className="flex items-center gap-2 mb-2">
            {!prompt.imageUrl && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                {prompt.model}
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">
              {prompt.category}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              {prompt.creator?.name || prompt.author || 'Creator'}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
            {prompt.title}
          </h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {prompt.description}
          </p>

          {/* Dynamic Variable Customizer */}
          {prompt.variables && prompt.variables.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Customize Parameters (Updates Live Below)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prompt.variables.map((variable: any) => (
                  <div key={variable.key}>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {variable.label} <span className="text-slate-500 font-mono">[{variable.key}]</span>
                    </label>
                    <input
                      type="text"
                      value={variableValues[variable.key] || ''}
                      onChange={(e) => setVariableValues({
                        ...variableValues,
                        [variable.key]: e.target.value
                      })}
                      placeholder={variable.description}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-cyan-100 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Prompt Box with One-Click Copy */}
          <div className="relative mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Ready-to-Run Prompt
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-cyan-200 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed selection:bg-cyan-500/30">
              {computedPrompt}
            </pre>
          </div>

          {/* Negative Prompt if available */}
          {prompt.negativePrompt && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Negative Prompt (What to Avoid)
                </span>
                <button
                  onClick={handleCopyNegative}
                  className="text-xs text-rose-300 hover:text-rose-200 font-semibold cursor-pointer"
                >
                  {copiedNegative ? 'Copied!' : 'Copy Negative'}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-300">
                {prompt.negativePrompt}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">How to use: </span>
              {prompt.instructions || 'Copy and paste directly into your chosen AI image generator or studio.'}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={getToolUrl(prompt.model)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <span>Launch {prompt.model} website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleCopy}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-cyan-500/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Final Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
