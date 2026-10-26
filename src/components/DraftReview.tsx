import React, { useState } from 'react';
import {
  Copy,
  Check,
  Mail,
  FileText,
  Eye,
  Edit3,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { GeneratedEmail, ActionItem } from '../types.ts';
import {
  formatPlainTextEmail,
  formatHtmlEmail,
  copyToClipboardRich,
  generateMailtoUrl,
} from '../utils/emailFormatter.ts';

interface DraftReviewProps {
  email: GeneratedEmail | null;
  setEmail: React.Dispatch<React.SetStateAction<GeneratedEmail | null>>;
  isGenerating: boolean;
}

export const DraftReview: React.FC<DraftReviewProps> = ({
  email,
  setEmail,
  isGenerating,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'edit' | 'raw'>('preview');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleCopyEmail = async () => {
    if (!email) return;
    const plainText = formatPlainTextEmail(email);
    const htmlText = formatHtmlEmail(email);
    const success = await copyToClipboardRich(plainText, htmlText);
    if (success) {
      setIsCopied(true);
      showToast('Complete email with subject line copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    } else {
      showToast('Copied email to clipboard.');
    }
  };

  const handleCopyPlainText = async () => {
    if (!email) return;
    const plainText = formatPlainTextEmail(email);
    try {
      await navigator.clipboard.writeText(plainText);
      showToast('Copied plain text draft!');
    } catch (e) {
      console.error(e);
      showToast('Failed to copy.');
    }
  };

  const handleOpenMailClient = () => {
    if (!email) return;
    const plainText = formatPlainTextEmail(email);
    const url = generateMailtoUrl(email.subjectLine, plainText);
    window.location.href = url;
  };

  // Editing helpers
  const handleUpdateItem = (index: number, field: keyof ActionItem, value: string) => {
    if (!email) return;
    const updated = [...email.actionItems];
    updated[index] = { ...updated[index], [field]: value };
    setEmail({ ...email, actionItems: updated });
  };

  const handleAddItem = () => {
    if (!email) return;
    const newItem: ActionItem = {
      task: 'New follow-up deliverable',
      owner: 'TBD',
      dueDate: 'TBD',
      priority: 'Normal',
    };
    setEmail({
      ...email,
      hasActionItems: true,
      actionItems: [...email.actionItems, newItem],
    });
  };

  const handleDeleteItem = (index: number) => {
    if (!email) return;
    const updated = email.actionItems.filter((_, i) => i !== index);
    setEmail({
      ...email,
      actionItems: updated,
      hasActionItems: updated.length > 0,
      noActionItemsMessage:
        updated.length === 0
          ? 'No action items remaining in this draft.'
          : email.noActionItemsMessage,
    });
  };

  // 1. Loading Skeleton State
  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 w-48 bg-slate-200 animate-pulse rounded" />
          <div className="h-7 w-28 bg-slate-200 animate-pulse rounded-lg" />
        </div>
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Skeleton Subject */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="h-3 w-16 bg-slate-200 animate-pulse rounded" />
            <div className="h-5 w-3/4 bg-slate-300 animate-pulse rounded" />
          </div>

          {/* Skeleton Opening */}
          <div className="space-y-2">
            <div className="h-4 w-5/6 bg-slate-200 animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-slate-200 animate-pulse rounded" />
          </div>

          {/* Skeleton Summary Box */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="h-3 w-28 bg-slate-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
            <div className="h-4 w-11/12 bg-slate-200 animate-pulse rounded" />
            <div className="h-4 w-4/5 bg-slate-200 animate-pulse rounded" />
          </div>

          {/* Skeleton Table */}
          <div className="space-y-3">
            <div className="h-4 w-36 bg-slate-200 animate-pulse rounded" />
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="h-9 bg-slate-100 border-b border-slate-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-slate-100 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty State
  if (!email) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Stakeholder-Ready Draft Email
          </h2>
          <span className="text-xs text-slate-400">Waiting for input</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200/60">
            <Mail className="w-7 h-7 stroke-[1.5]" />
          </div>

          <h3 className="text-base font-semibold text-slate-900 mb-1.5">
            No Draft Generated Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-6">
            Paste rough notes, incomplete drafts, or select one of the sample scenarios on the left.
            The engine will extract real actions into a table, enforce strict TBD rules, and draft a concise executive summary.
          </p>

          {/* Ghost outline representation */}
          <div className="w-full max-w-md p-4 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-left space-y-2.5 opacity-70">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="text-slate-600 font-medium">Subject:</span> [Project Name] - Status Update & Key Action Items
            </div>
            <div className="h-px bg-slate-200/60" />
            <div className="text-[11px] text-slate-400 italic">
              Opening thanking attendees for their time...
            </div>
            <div className="p-2.5 rounded bg-white border border-slate-200/60 text-[11px] text-slate-500">
              Executive Summary (2–4 crisp sentences of critical facts & decisions)
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 font-mono bg-white p-2 rounded border border-slate-200/60">
              <span>Deliverable</span>
              <span>Owner (or TBD)</span>
              <span>Due Date</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Populated Generated State
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Panel Top Action Bar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'preview'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Email Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'edit'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Draft</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'raw'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Plain Text</span>
          </button>
        </div>

        {/* Copy & Export Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {copyFeedback && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md animate-fadeIn flex items-center gap-1.5 shadow-2xs">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{copyFeedback}</span>
            </span>
          )}

          {/* Primary "Copy Email" button */}
          <button
            type="button"
            onClick={handleCopyEmail}
            title="Copy complete generated email with subject line and body to clipboard"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 ${
              isCopied
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Email Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 shrink-0" />
                <span>Copy Email</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyPlainText}
            title="Copy as plain text"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleOpenMailClient}
            title="Open draft in default desktop mail client"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
        {/* PREVIEW VIEW */}
        {viewMode === 'preview' && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 max-w-3xl mx-auto space-y-6">
            {/* Subject Line Bar */}
            <div className="pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Subject Line
                </span>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {email.subjectLine}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(email.subjectLine);
                  showToast('Subject line copied!');
                }}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                title="Copy subject line"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Email Body: Opening */}
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {email.opening}
            </div>

            {/* Meeting / Executive Summary Callout */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>Executive Summary</span>
              </h2>
              <p className="text-sm text-slate-800 leading-relaxed">
                {email.summary}
              </p>
            </div>

            {/* Action Items Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Action Items & Deliverables</span>
                  {email.hasActionItems && (
                    <span className="text-xs text-slate-500 font-normal">
                      ({email.actionItems.length} items)
                    </span>
                  )}
                </h2>
              </div>

              {email.hasActionItems && email.actionItems.length > 0 ? (
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                        <th className="py-2.5 px-3.5">Deliverable / Action</th>
                        <th className="py-2.5 px-3.5 w-36">Owner</th>
                        <th className="py-2.5 px-3.5 w-36">Due Date</th>
                        <th className="py-2.5 px-3.5 w-28">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {email.actionItems.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-2.5 px-3.5 text-slate-900 font-medium leading-relaxed">
                            {item.task}
                          </td>
                          <td className="py-2.5 px-3.5">
                            {item.owner === 'TBD' ? (
                              <span className="inline-block text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[11px]">
                                TBD
                              </span>
                            ) : (
                              <span className="text-slate-800 font-medium">
                                {item.owner}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3.5 tabular-nums">
                            {item.dueDate === 'TBD' ? (
                              <span className="inline-block text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[11px]">
                                TBD
                              </span>
                            ) : (
                              <span className="text-slate-700 font-mono text-[11px]">
                                {item.dueDate}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span
                              className={`text-[11px] font-medium ${
                                item.priority?.includes('Urgent') || item.priority?.includes('Blocker')
                                  ? 'text-rose-700 font-semibold'
                                  : item.priority === 'High'
                                  ? 'text-amber-700'
                                  : 'text-slate-500'
                              }`}
                            >
                              {item.priority || 'Normal'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                  {email.noActionItemsMessage ||
                    'No real follow-up action items identified in these notes.'}
                </div>
              )}
            </div>

            {/* Missing Information / PM Clarifications Box */}
            {email.missingInformationAlerts && email.missingInformationAlerts.length > 0 && (
              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Missing Details to Clarify Before Sending</span>
                </div>
                <p className="text-xs text-amber-800">
                  Per strict rules, missing facts or unassigned owners are never guessed. The following gaps were noted:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900">
                  {email.missingInformationAlerts.map((alert, idx) => (
                    <li key={idx}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Email Closing */}
            <div className="pt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100">
              {email.closing}
            </div>

            {/* Bottom Copy Email Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 -mx-6 -mb-6 p-4 rounded-b-xl">
              <span className="text-xs text-slate-500">
                Ready to review & send · Complete email with subject line & table
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 ${
                  isCopied
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
        {viewMode === 'edit' && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 max-w-3xl mx-auto space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={email.subjectLine}
                onChange={(e) => setEmail({ ...email, subjectLine: e.target.value })}
                className="w-full px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Opening Salutation
              </label>
              <textarea
                rows={2}
                value={email.opening}
                onChange={(e) => setEmail({ ...email, opening: e.target.value })}
                className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Executive Summary (2–4 Sentences)
              </label>
              <textarea
                rows={4}
                value={email.summary}
                onChange={(e) => setEmail({ ...email, summary: e.target.value })}
                className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-sans leading-relaxed"
              />
            </div>

            {/* Action Items Editable Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Action Items Table
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Row</span>
                </button>
              </div>

              <div className="space-y-2">
                {email.actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-12 sm:col-span-5">
                      <input
                        type="text"
                        value={item.task}
                        onChange={(e) => handleUpdateItem(idx, 'task', e.target.value)}
                        placeholder="Deliverable description"
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <input
                        type="text"
                        value={item.owner}
                        onChange={(e) => handleUpdateItem(idx, 'owner', e.target.value)}
                        placeholder="Owner or TBD"
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <input
                        type="text"
                        value={item.dueDate}
                        onChange={(e) => handleUpdateItem(idx, 'dueDate', e.target.value)}
                        placeholder="Due Date or TBD"
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Closing
              </label>
              <textarea
                rows={3}
                value={email.closing}
                onChange={(e) => setEmail({ ...email, closing: e.target.value })}
                className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-sans"
              />
            </div>
          </div>
        )}

        {/* RAW PLAINTEXT VIEW */}
        {viewMode === 'raw' && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Raw Plaintext Format
              </span>
              <button
                type="button"
                onClick={handleCopyPlainText}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Plaintext</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {formatPlainTextEmail(email)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
