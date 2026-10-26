export interface ActionItem {
  id?: string;
  task: string;
  owner: string;
  dueDate: string;
  priority?: 'Urgent/Blocker' | 'High' | 'Normal' | 'TBD' | string;
}

export interface GeneratedEmail {
  subjectLine: string;
  opening: string;
  summary: string;
  hasActionItems: boolean;
  noActionItemsMessage?: string;
  actionItems: ActionItem[];
  missingInformationAlerts?: string[];
  materialRisksOrDecisionsHighlighted?: string[];
  closing: string;
}

export interface SampleNote {
  id: string;
  title: string;
  badge: string;
  description: string;
  rawNotes: string;
  projectContext?: string;
  meetingDate?: string;
  audience?: string;
}
