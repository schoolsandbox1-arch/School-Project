import React from 'react';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenRules: () => void;
  onSelectSample: () => void;
  onNewDraft: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRules,
  onSelectSample,
  onNewDraft,
  isGenerating,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm">
            PD
          </div>
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            PulseDraft
          </a>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-normal">
            / Stakeholder Email Studio
          </span>
        </div>

        {/* Zone 2: Navigation & Information links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onSelectSample}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sample Scenarios
          </button>
          <button
            type="button"
            onClick={onOpenRules}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PM Guardrails</span>
          </button>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              onOpenRules();
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Rules & Verification
          </a>
        </nav>

        {/* Zone 3: 1 Primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onNewDraft}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 shadow-sm"
          >
            New Draft
          </button>
        </div>
      </div>
    </header>
  );
};
