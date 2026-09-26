import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface NewsletterBannerProps {
  onOpenSubmit: () => void;
  onTriggerToast: (msg: string) => void;
}

export const NewsletterBanner: React.FC<NewsletterBannerProps> = ({
  onOpenSubmit,
  onTriggerToast,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      onTriggerToast(`Welcome aboard! Weekly prompt drop sent to ${email}`);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-b from-[#0B0F19] to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Submit Prompt CTA Box */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Have a Killer Prompt?
              </h3>
              
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                PromptCare is powered by practitioners. If you’ve tuned a prompt for coding, conversion copywriting, or cinematic image generation, submit it and get featured on promptcare.online.
              </p>
            </div>

            <div>
              <button
                onClick={onOpenSubmit}
                className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Submit Your Prompt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-800/40 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
                <Mail className="w-6 h-6" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Weekly Prompt Digest
              </h3>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Join 24,000+ AI enthusiasts. Receive 5 verified, high-performing prompts, new AI tool releases, and prompt engineering cheat-sheets every Tuesday morning.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-sm transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {subscribed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <span>Subscribe Free</span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero spam. One-click unsubscribe anytime.</span>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
