import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are an expert Project Management Communications Specialist.
Your mission is to transform user-provided project information, rough meeting notes, status reports, or incomplete drafts into a polished, stakeholder-ready project email.

CRITICAL INSTRUCTIONS & STRICT RULES:
1. SOURCE OF TRUTH:
   - Use ONLY information supplied by the user. The user's input is the sole source of truth.
   - Do NOT access, claim to access, or pretend to connect to live Gmail, Google Drive, Google Calendar, Jira, or any organizational systems.
   - Preserve the user's intended message while improving clarity, structure, conciseness, professionalism, and tone.

2. ACTION ITEMS TABLE RULES:
   - Extract ONLY real, forward-looking operational tasks and deliverables that someone must perform or complete.
   - ABSOLUTE RULE - NEVER PUT DECISIONS IN ACTIONS: Do NOT pull decisions, approvals, scope changes, or strategic agreements into the Action Items table. Decisions belong in the Executive Summary, NEVER as action items.
     * Example: If the team "decided to descope module X" or "approved Change Request #14", that is a DECISION for the summary, NOT an action item.
     * Action items must be concrete operational work (e.g., "Run stress tests", "Draft rollback procedure document").
   - Distinguish real forward-looking tasks from:
     * Decisions, agreements, and approvals (strictly keep in summary, never in actions)
     * General discussion, opinions, and suggestions
     * Past completed accomplishments (e.g. "VPC peering setup is done")
   - Do NOT invent actions, owners, dates, outcomes, or acronym expansions.
   - Use "TBD" for missing or unresolved owners and due dates.
   - Do NOT infer ownership from who spoke, a person's role, title, or an attendee list.
   - Preserve ambiguous relative deadlines exactly as stated (e.g. "by end of next week", "prior to launch"); convert them to calendar dates ONLY when a reference meeting date is supplied and the intended calendar date is completely unambiguous.
   - Consolidate overlapping actions without losing distinct deliverables, owners, or deadlines.
   - Select the top 8 to 10 real action items when enough exist; include fewer when fewer are supported. NEVER pad the table.
   - Prioritize explicitly urgent or blocking items first, followed by earlier known due dates before later ones. Place undated items after dated items unless explicit urgency warrants otherwise.
   - If NO real actions exist in the source material, set hasActionItems to false and provide a clear, professional statement in noActionItemsMessage rather than fabricating placeholder actions.

3. SUMMARY & CONTENT RULES:
   - Opening: A courteous opening thanking attendees for their time and collaboration.
   - Summary: A crisp executive summary in 2 to 4 sentences containing the most important project information, key decisions made, and material risks or issues. All decisions, approvals, and scope adjustments belong here.
   - NEVER hide or minimize material project risks, technical blockers, budget concerns, or missed milestones.
   - Closing: An appropriate, collaborative, and pleasant closing inviting feedback and questions.

4. MISSING INFORMATION & UNRESOLVED GAPS:
   - Do NOT guess when critical information is missing.
   - Instead, clearly identify missing information in missingInformationAlerts (e.g., missing approvals, unassigned critical blockers, unconfirmed launch dates) so the project manager is aware before sending.

5. NEVER DO THE FOLLOWING:
   - Never pull decisions, choices, approvals, or agreed-upon positions into the Action Items table.
   - Never invent project facts, decisions, dates, owners, approvals, commitments, or stakeholder positions.
   - Never present assumptions or inferences as facts.
   - Never change the underlying meaning of the user's message.
   - Never use aggressive, accusatory, or unprofessional language.
   - Never claim an email has been sent or that an action has been completed if it has not.
`;

app.post('/api/generate-email', async (req: Request, res: Response) => {
  try {
    const { rawNotes, meetingDate, audience, projectContext } = req.body;

    if (!rawNotes || typeof rawNotes !== 'string' || !rawNotes.trim()) {
      res.status(400).json({ error: 'Please provide project notes or a draft to transform.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    const prompt = `Please transform the following project notes into a polished, stakeholder-ready project email adhering strictly to all system instructions.

CONTEXT PROVIDED BY PM:
- Project / Context: ${projectContext ? projectContext.trim() : 'Not explicitly specified'}
- Reference / Meeting Date: ${meetingDate ? meetingDate.trim() : 'Not explicitly specified (preserve relative dates)'}
- Target Audience: ${audience ? audience.trim() : 'Project Stakeholders & Team Members'}

SOURCE NOTES / DRAFT:
"""
${rawNotes.trim()}
"""`;

    // Retry with backoff for transient API rate limits or 503 high demand spikes
    let attempts = 0;
    const maxAttempts = 3;
    let response: any = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2, // Low temperature for high factual adherence and zero hallucination
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                subjectLine: {
                  type: Type.STRING,
                  description: 'A clear, professional project email subject line.',
                },
                opening: {
                  type: Type.STRING,
                  description: 'An appropriate opening thanking stakeholders/attendees for their time.',
                },
                summary: {
                  type: Type.STRING,
                  description: 'A 2 to 4 sentence executive summary of the meeting/update.',
                },
                hasActionItems: {
                  type: Type.BOOLEAN,
                  description: 'True if real action items were identified in the source notes.',
                },
                noActionItemsMessage: {
                  type: Type.STRING,
                  description: 'Clear statement if no real follow-up actions exist.',
                },
                actionItems: {
                  type: Type.ARRAY,
                  description: 'Top forward-looking task deliverables only. ABSOLUTELY NEVER include decisions, approvals, scope changes, or agreements here—those belong strictly in summary. Max 10.',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      task: {
                        type: Type.STRING,
                        description: 'Specific operational task or deliverable to be executed. Must NEVER be a decision, approval, or agreed choice. Never invented.',
                      },
                      owner: {
                        type: Type.STRING,
                        description: 'Exact owner or "TBD" if missing/unresolved. NEVER inferred.',
                      },
                      dueDate: {
                        type: Type.STRING,
                        description: 'Due date or preserved relative deadline or "TBD" if missing. Never guessed.',
                      },
                      priority: {
                        type: Type.STRING,
                        description: 'Urgency flag: "Urgent/Blocker", "High", "Normal", or "TBD".',
                      },
                    },
                    required: ['task', 'owner', 'dueDate'],
                  },
                },
                missingInformationAlerts: {
                  type: Type.ARRAY,
                  description: 'List of critical missing information or ambiguities that prevent a reliable draft.',
                  items: {
                    type: Type.STRING,
                  },
                },
                materialRisksOrDecisionsHighlighted: {
                  type: Type.ARRAY,
                  description: 'Key material risks or decisions preserved faithfully from the input.',
                  items: {
                    type: Type.STRING,
                  },
                },
                closing: {
                  type: Type.STRING,
                  description: 'Professional, pleasant, and collaborative sign-off inviting questions or next steps.',
                },
              },
              required: ['subjectLine', 'opening', 'summary', 'hasActionItems', 'actionItems', 'closing'],
            },
          },
        });
        break; // Success
      } catch (err: any) {
        const errMsg = err?.message || '';
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429') ||
          errMsg.includes('high demand') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        if (isTransient && attempts < maxAttempts) {
          console.warn(`Transient Gemini error (attempt ${attempts}/${maxAttempts}), retrying in ${attempts * 1200}ms...`);
          await new Promise((resolve) => setTimeout(resolve, attempts * 1200));
        } else {
          throw err;
        }
      }
    }

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response received from Gemini.');
    }

    const parsedData = JSON.parse(textOutput);
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating stakeholder email:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate stakeholder email. Please try again.',
    });
  }
});

// Full-stack Vite handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PulseDraft server running on port ${PORT}`);
  });
}

startServer();
