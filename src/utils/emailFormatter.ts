import { GeneratedEmail } from '../types.ts';

export function formatPlainTextEmail(email: GeneratedEmail): string {
  const lines: string[] = [];

  // Subject line
  lines.push(`Subject: ${email.subjectLine}`);
  lines.push('');

  // Opening
  lines.push(email.opening);
  lines.push('');

  // Executive Summary
  lines.push('---');
  lines.push('PROJECT / MEETING SUMMARY');
  lines.push(email.summary);
  lines.push('');

  // Action Items Table
  lines.push('---');
  lines.push('ACTION ITEMS & NEXT STEPS');
  if (email.hasActionItems && email.actionItems && email.actionItems.length > 0) {
    // Format as structured tabular text
    lines.push('| Deliverable / Action Item | Owner | Due Date | Priority |');
    lines.push('| :------------------------ | :---- | :------- | :------- |');
    email.actionItems.forEach((item) => {
      lines.push(`| ${item.task} | ${item.owner || 'TBD'} | ${item.dueDate || 'TBD'} | ${item.priority || 'Normal'} |`);
    });
  } else {
    lines.push(email.noActionItemsMessage || 'No real follow-up action items identified from this session.');
  }
  lines.push('');

  // Missing Information / PM Notice if any
  if (email.missingInformationAlerts && email.missingInformationAlerts.length > 0) {
    lines.push('---');
    lines.push('ITEMS REQUIRING CLARIFICATION / MISSING DETAILS:');
    email.missingInformationAlerts.forEach((alert) => {
      lines.push(`• ${alert}`);
    });
    lines.push('');
  }

  // Closing
  lines.push(email.closing);

  return lines.join('\n');
}

export function formatHtmlEmail(email: GeneratedEmail): string {
  const actionItemsHtml = email.hasActionItems && email.actionItems && email.actionItems.length > 0
    ? `
    <table style="width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px;">
      <thead>
        <tr style="background-color: #f1f5f9; text-align: left; border-bottom: 2px solid #cbd5e1;">
          <th style="padding: 10px 14px; font-weight: 600; color: #1e293b;">Deliverable / Action Item</th>
          <th style="padding: 10px 14px; font-weight: 600; color: #1e293b; width: 140px;">Owner</th>
          <th style="padding: 10px 14px; font-weight: 600; color: #1e293b; width: 140px;">Due Date</th>
          <th style="padding: 10px 14px; font-weight: 600; color: #1e293b; width: 110px;">Status / Priority</th>
        </tr>
      </thead>
      <tbody>
        ${email.actionItems
          .map(
            (item, index) => `
          <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px 14px; color: #334155; line-height: 1.4;">${escapeHtml(item.task)}</td>
            <td style="padding: 10px 14px; font-weight: ${item.owner === 'TBD' ? '600' : '500'}; color: ${item.owner === 'TBD' ? '#b45309' : '#0f172a'};">${escapeHtml(item.owner || 'TBD')}</td>
            <td style="padding: 10px 14px; color: ${item.dueDate === 'TBD' ? '#b45309' : '#334155'}; font-variant-numeric: tabular-nums;">${escapeHtml(item.dueDate || 'TBD')}</td>
            <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">${escapeHtml(item.priority || 'Normal')}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>`
    : `<p style="padding: 12px 16px; background-color: #f8fafc; border-radius: 6px; color: #64748b; font-style: italic; margin-top: 10px; margin-bottom: 16px;">
        ${escapeHtml(email.noActionItemsMessage || 'No real follow-up action items identified from this session.')}
       </p>`;

  const missingInfoHtml = email.missingInformationAlerts && email.missingInformationAlerts.length > 0
    ? `
    <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 12px 16px; border-radius: 6px; margin-top: 16px; margin-bottom: 16px;">
      <p style="font-weight: 600; color: #854d0e; margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Attention: Unresolved Details to Clarify</p>
      <ul style="margin: 0; padding-left: 20px; color: #713f12; font-size: 13px;">
        ${email.missingInformationAlerts.map(alert => `<li style="margin-bottom: 4px;">${escapeHtml(alert)}</li>`).join('')}
      </ul>
    </div>`
    : '';

  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 680px;">
    <div style="border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 20px;">
      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Subject</span>
      <h2 style="margin: 0; font-size: 17px; color: #0f172a; font-weight: 700; line-height: 1.3;">${escapeHtml(email.subjectLine)}</h2>
    </div>

    <p style="margin-bottom: 16px; font-size: 15px;">${escapeHtml(email.opening).replace(/\n/g, '<br/>')}</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; font-weight: 600;">Meeting & Project Summary</h3>
      <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.5;">${escapeHtml(email.summary)}</p>
    </div>

    <h3 style="margin: 20px 0 6px 0; font-size: 15px; color: #0f172a; font-weight: 600;">Action Items & Follow-ups</h3>
    ${actionItemsHtml}

    ${missingInfoHtml}

    <p style="margin-top: 24px; font-size: 15px; color: #1e293b;">${escapeHtml(email.closing).replace(/\n/g, '<br/>')}</p>
  </div>`;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function copyToClipboardRich(plainText: string, htmlContent: string): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob,
        }),
      ]);
      return true;
    } else {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (err) {
    console.warn('Rich clipboard write failed, falling back to writeText:', err);
    try {
      await navigator.clipboard.writeText(plainText);
      return true;
    } catch (fallbackErr) {
      console.error('All clipboard methods failed:', fallbackErr);
      return false;
    }
  }
}

export function generateMailtoUrl(subject: string, bodyText: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyText);
  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
}
