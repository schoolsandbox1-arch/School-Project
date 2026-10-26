import React from 'react';
import { X, CheckCircle2, AlertOctagon, Lock, Database, Table, HelpCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Project Communications Guardrails & Compliance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict rules enforced on every email generation to guarantee accuracy and reliability.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
          {/* Section 1: Extraction & Action Items Rules */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <h3 className="font-semibold text-slate-900 text-sm">Action Items & Data Extraction</h3>
            </div>
            <ul className="space-y-2 text-slate-600 pl-6 list-disc text-xs sm:text-sm">
              <li>
                <strong className="text-slate-800">Real Follow-up Actions Only:</strong> Clearly distinguishes actionable follow-ups from mere discussion, passing suggestions, or already completed milestones.
              </li>
              <li>
                <strong className="text-slate-800">Decisions Stay in Summary:</strong> Decisions, scope approvals, and strategic agreements are captured strictly in the Executive Summary and are never pulled into the Action Items table.
              </li>
              <li>
                <strong className="text-slate-800">Strict TBD Policy:</strong> Uses <code className="bg-slate-100 text-amber-800 px-1 py-0.5 rounded text-xs">TBD</code> for missing or unresolved owners and due dates. Never guesses owners from speaker identities or attendee lists.
              </li>
              <li>
                <strong className="text-slate-800">Preserved Deadlines:</strong> Relative deadlines (e.g. &ldquo;by end of next week&rdquo;) are preserved as stated; only converted to calendar dates when unambiguous.
              </li>
              <li>
                <strong className="text-slate-800">No Table Padding:</strong> Extracts top 8–10 real items prioritized by blockers and due dates. If no real actions exist, states so explicitly instead of creating placeholders.
              </li>
              <li>
                <strong className="text-slate-800">Concise 2–4 Sentence Summary:</strong> Captures critical decisions and updates without fluff.
              </li>
            </ul>
          </div>

          {/* Section 2: Zero-Hallucination Boundaries (NEVER) */}
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
              <h3 className="font-semibold text-rose-950 text-sm">Strict Zero-Hallucination Boundaries</h3>
            </div>
            <ul className="space-y-1.5 text-rose-900 text-xs sm:text-sm pl-5 list-disc">
              <li>Never invents project facts, decisions, dates, commitments, or owners.</li>
              <li>Never minimizes, conceals, or hides material risks, blockers, or budget overruns.</li>
              <li>Never changes the underlying meaning of the user&apos;s source notes.</li>
              <li>Never claims an email was sent or that an action has been completed when it has not.</li>
              <li>Identifies critical missing information clearly so the PM can address it before sending.</li>
            </ul>
          </div>

          {/* Section 3: Privacy & Zero Organizational System Access */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-slate-700 shrink-0" />
              <h3 className="font-semibold text-slate-900 text-sm">Hermetic Privacy</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This application functions strictly on the text you paste. It has no integration with or access to live organizational Gmail, Google Drive, Google Calendar, or internal company wikis. Your raw notes remain solely within this generation session.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
};
