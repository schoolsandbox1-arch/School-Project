import React, { useState } from 'react';
import { Sparkles, Clipboard, Trash2, SlidersHorizontal, AlertCircle, Check, FileText } from 'lucide-react';
import { SAMPLE_NOTES, PRIMARY_PM_SAMPLE } from '../data/sampleNotes.ts';
import { SampleNote } from '../types.ts';

interface InputPanelProps {
  rawNotes: string;
  setRawNotes: (value: string) => void;
  meetingDate: string;
  setMeetingDate: (value: string) => void;
  audience: string;
  setAudience: (value: string) => void;
  projectContext: string;
  setProjectContext: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  errorMessage: string | null;
  setErrorMessage: (value: string | null) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  rawNotes,
  setRawNotes,
  meetingDate,
  setMeetingDate,
  audience,
  setAudience,
  projectContext,
  setProjectContext,
  isGenerating,
  onGenerate,
  errorMessage,
  setErrorMessage,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [copiedSampleId, setCopiedSampleId] = useState<string | null>(null);
  const [justLoadedSample, setJustLoadedSample] = useState<boolean>(false);

  const wordCount = rawNotes.trim() ? rawNotes.trim().split(/\s+/).length : 0;
  const charCount = rawNotes.length;

  const handleApplySample = (sample: SampleNote) => {
    if (errorMessage) setErrorMessage(null);
    setRawNotes(sample.rawNotes);
    if (sample.projectContext) setProjectContext(sample.projectContext);
    if (sample.meetingDate) setMeetingDate(sample.meetingDate);
    if (sample.audience) setAudience(sample.audience);
    setCopiedSampleId(sample.id);
    setJustLoadedSample(true);
    setTimeout(() => {
      setCopiedSampleId(null);
      setJustLoadedSample(false);
    }, 2000);
  };

  const handleTrySample = () => {
    handleApplySample(PRIMARY_PM_SAMPLE);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (errorMessage) setErrorMessage(null);
        setRawNotes(text);
      }
    } catch (err) {
      console.warn('Unable to read clipboard automatically:', err);
    }
  };

  const handleClear = () => {
    if (errorMessage) setErrorMessage(null);
    setRawNotes('');
    setProjectContext('');
    setMeetingDate('');
    setAudience('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full">
      {/* Panel Header with 'Try a Sample' Button beside the input area */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Project Notes & Source Material
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paste raw meeting notes, incomplete drafts, or status updates.
          </p>
        </div>

        {/* Action Controls Beside Input Area */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {/* Primary "Try a Sample" button as requested */}
          <button
            type="button"
            onClick={handleTrySample}
            title="Populate input with a realistic project manager sample note (status, risk, decision, and next steps)"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
              justLoadedSample
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            {justLoadedSample ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Sample Loaded!</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Try a Sample</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePasteClipboard}
            title="Paste from clipboard"
            className="p-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>
          {rawNotes && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear notes"
              className="p-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Scenarios Selector */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Quick Test Scenarios
          </span>
          <span className="text-[11px] text-slate-400">Click to load realistic notes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_NOTES.map((sample) => {
            const isLoaded = copiedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleApplySample(sample)}
                className={`p-2 text-left rounded-lg border transition-all text-xs cursor-pointer ${
                  isLoaded
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-medium truncate">{sample.title}</span>
                  {isLoaded ? (
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  ) : null}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{sample.badge}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Textarea Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col min-h-[320px] relative">
        <textarea
          value={rawNotes}
          onChange={(e) => {
            setRawNotes(e.target.value);
            if (errorMessage) {
              setErrorMessage(null);
            }
          }}
          placeholder={`Paste your project notes here... Example:
- Sync with Mobile Team on Tuesday
- Decided to delay push notifications to next release
- Sarah to draft security checklist by Friday
- Who owns cloud logging setup? Still unresolved.
- Budget review completed yesterday by CFO.`}
          className="w-full flex-1 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/40 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 font-sans resize-none transition-all"
        />

        {!rawNotes.trim() && !errorMessage && (
          <div className="absolute bottom-16 right-8 pointer-events-none hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Click &ldquo;Try a Sample&rdquo; above to load an example</span>
          </div>
        )}

        {/* Clear and friendly validation message below the input box */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-2.5 p-3 bg-amber-50/90 border border-amber-200/90 rounded-lg flex items-start gap-2.5 text-xs text-amber-900 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Live Counters */}
        <div className="flex items-center justify-between mt-2.5 text-xs text-slate-400 tabular-nums">
          <span>
            {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} chars
          </span>
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{showOptions ? 'Hide Context Fields' : 'Optional Context (Date, Audience)'}</span>
          </button>
        </div>

        {/* Optional Context Controls */}
        {showOptions && (
          <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3 transition-all animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Meeting / Reference Date
                </label>
                <input
                  type="text"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  placeholder="e.g. Oct 24, 2026 (helps resolve relative dates)"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Steering Committee, Engineering Leads"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Project Name or Workstream
              </label>
              <input
                type="text"
                value={projectContext}
                onChange={(e) => setProjectContext(e.target.value)}
                placeholder="e.g. Project Atlas - Cloud Infrastructure"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="hidden sm:inline text-[11px] text-slate-400">
          Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 text-[10px] font-mono shadow-2xs">Ctrl/⌘+Enter</kbd> to draft
        </span>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-sm cursor-pointer ml-auto"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Email...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-slate-300" />
              <span>Generate Email</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
