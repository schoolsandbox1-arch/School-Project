import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { InputPanel } from './components/InputPanel.tsx';
import { DraftReview } from './components/DraftReview.tsx';
import { RulesModal } from './components/RulesModal.tsx';
import { GeneratedEmail } from './types.ts';
import { SAMPLE_NOTES, PRIMARY_PM_SAMPLE } from './data/sampleNotes.ts';

export default function App() {
  const [rawNotes, setRawNotes] = useState<string>('');
  const [meetingDate, setMeetingDate] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [projectContext, setProjectContext] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);

  // Start with clean state so the user can type notes or click "Try a Sample" beside the input area


  const handleGenerate = useCallback(async () => {
    if (!rawNotes.trim()) {
      setErrorMessage('Please enter or paste some project information before generating an email.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawNotes,
          meetingDate: meetingDate.trim() || undefined,
          audience: audience.trim() || undefined,
          projectContext: projectContext.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate stakeholder email.');
      }

      setEmail(result.data);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(
        err?.message || 'An unexpected error occurred while drafting the email. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [rawNotes, meetingDate, audience, projectContext]);

  // Global keyboard shortcut: Cmd+Enter or Ctrl+Enter to trigger drafting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating && rawNotes.trim()) {
          handleGenerate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, isGenerating, rawNotes]);

  const handleNewDraft = () => {
    setRawNotes('');
    setMeetingDate('');
    setAudience('');
    setProjectContext('');
    setEmail(null);
    setErrorMessage(null);
  };

  const handleSelectSample = () => {
    const sample = PRIMARY_PM_SAMPLE;
    setRawNotes(sample.rawNotes);
    if (sample.projectContext) setProjectContext(sample.projectContext);
    if (sample.meetingDate) setMeetingDate(sample.meetingDate);
    if (sample.audience) setAudience(sample.audience);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900">
      {/* Top Bar following contract */}
      <Header
        onOpenRules={() => setIsRulesModalOpen(true)}
        onSelectSample={handleSelectSample}
        onNewDraft={handleNewDraft}
        isGenerating={isGenerating}
      />

      {/* Main Workspace: 2-column balanced screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Workspace Subtitle */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Project Communication Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Turn rough notes into a concise, professional stakeholder email with a verified action items table.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Source Grounded
            </span>
            <span aria-hidden="true">·</span>
            <span>Zero Hallucination</span>
            <span aria-hidden="true">·</span>
            <span>Strict TBDs</span>
          </div>
        </div>

        {/* 2-Column Split: Input Panel (Left) & Draft Review (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[580px] lg:h-[calc(100vh-12rem)]">
          {/* Left Column: Input Panel */}
          <div className="h-full flex flex-col">
            <InputPanel
              rawNotes={rawNotes}
              setRawNotes={setRawNotes}
              meetingDate={meetingDate}
              setMeetingDate={setMeetingDate}
              audience={audience}
              setAudience={setAudience}
              projectContext={projectContext}
              setProjectContext={setProjectContext}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </div>

          {/* Right Column: Draft Review */}
          <div className="h-full flex flex-col">
            <DraftReview
              email={email}
              setEmail={setEmail}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">PulseDraft</span>
            <span aria-hidden="true">·</span>
            <span>Project stakeholder communication engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side privacy · No external mail/calendar access</span>
          </div>
        </div>
      </footer>

      {/* PM Compliance & Guardrails Modal */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
