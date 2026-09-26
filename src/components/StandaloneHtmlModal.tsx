import React, { useState } from 'react';
import { X, Download, Copy, Check, ExternalLink, FileCode, CheckCircle2 } from 'lucide-react';

interface StandaloneHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
}

export const StandaloneHtmlModal: React.FC<StandaloneHtmlModalProps> = ({
  isOpen,
  onClose,
  onTriggerToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    // Fetch or create download link for public/promptcare-standalone.html
    const link = document.createElement('a');
    link.href = '/promptcare-standalone.html';
    link.download = 'promptcare-standalone.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerToast('Downloaded standalone HTML file! Ready to deploy anywhere.');
  };

  const handleCopyCode = async () => {
    try {
      const res = await fetch('/promptcare-standalone.html');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onTriggerToast('Single-file HTML code copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      onTriggerToast('Error copying code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <FileCode className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">Single-File Deployment</span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Standalone Single HTML File
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
          As requested, the complete PromptCare application is also packaged as an independent, self-contained <code className="text-cyan-300 font-mono">index.html</code> with zero external build tools required. It includes Tailwind CSS CDN, vanilla JS, the full prompt dataset, live search, categories, modals, and dark mode.
        </p>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Zero Build Step Needed</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Upload directly to Netlify Drop, GitHub Pages, Vercel, Cloudflare Pages, cPanel, or any static hosting server.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download HTML File</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Full HTML Code</span>
              </>
            )}
          </button>

          <a
            href="/promptcare-standalone.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto p-3 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Preview standalone HTML in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
