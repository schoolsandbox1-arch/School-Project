import { SampleNote } from '../types.ts';

export const PRIMARY_PM_SAMPLE: SampleNote = {
  id: 'pm-sample-status-risk-decision-nextsteps',
  title: 'Sprint 14 Checkout & Payment Gateway Sync',
  badge: 'Status · Risk · Decision · Next Steps',
  description: 'Realistic PM rough notes containing project status, an issue/risk, a key decision, and action items with deadlines.',
  projectContext: 'Mobile Checkout Experience - Sprint 14',
  meetingDate: 'October 25, 2026',
  audience: 'E-Commerce Steering Committee & Core Team',
  rawNotes: `Mobile Checkout Modernization - Weekly Standup Notes
Date: October 25, 2026
Project Lead: Jordan Vance

1. Project Status:
- Sprint 14 execution is currently at 85% completion.
- Core checkout API refactor and mobile beta v2.4 build were deployed to staging yesterday for QA regression testing.

2. Issue & Material Risk:
- Third-party payment gateway sandbox is experiencing intermittent response latency spikes averaging 2.4 seconds per transaction.
- Material Risk: If unresolved, this risks failing our 500ms transaction SLA benchmark and could jeopardize our scheduled November 15 public release.

3. Key Decision Made:
- Decided in today's sync to descope the loyalty rewards points module from the initial release to Phase 2. This protects our November 15 launch target date while ensuring checkout reliability.

4. Next Steps & Follow-ups:
- Alex Rivera: Conduct load stress tests on the backup payment gateway and distribute the latency performance report by Thursday, Nov 2.
- Priya Nair: Schedule an emergency escalation meeting with the payment gateway partner lead by Wednesday, Nov 1 at 2 PM.
- Owner TBD: Update the production rollback procedure and change ticket before Friday's change advisory board review.`,
};

export const SAMPLE_NOTES: SampleNote[] = [
  PRIMARY_PM_SAMPLE,
  {
    id: 'sprint-cloud-migration',
    title: 'Cloud Migration & Database Cutover',
    badge: 'Mixed Owners & TBDs',
    description: 'Engineering notes with technical blockers, completed items, relative deadlines, and unresolved owners.',
    projectContext: 'Project Atlas - Cloud Infrastructure Modernization',
    meetingDate: 'October 24, 2026',
    audience: 'Engineering Leads & Executive Sponsors',
    rawNotes: `Atlas Cloud Migration - Weekly Sync
Date: Oct 24, 2026
Attendees: Sarah Jenkins (Tech Lead), Marcus Vance (DevOps), Elena Rostova (DBA), Dave K. (Product PM), Rachel Liu (Security)

Updates:
- Marcus completed VPC peering setup and staging load testing yesterday. That part is fully verified and done.
- Database cutover dry-run: Elena reported a replica latency spike of 420ms under peak read volume. This is a critical blocker for our scheduled Nov 14 cutover date.
- Elena will optimize the read-replica indexes and rerun the stress benchmark by Tuesday, Oct 28.
- We need someone to review the SSL termination certs on the backup ingress gateway before Friday. No one volunteered during the call yet.
- Security audit sign-off: Rachel mentioned SOC2 compliance packet is awaiting third-party vendor review. Vendor promised feedback by Nov 3.
- Dave asked about rollback runbook documentation. Sarah agreed to finalize the step-by-step rollback procedure document by end of next week.
- Discussion on whether to support legacy v1 API endpoints for mobile clients after migration. Team generally thinks yes, but no decision was made.
- Hardware decommission timeline was discussed briefly. Elena suggested waiting 30 days post-cutover before terminating on-prem instances.
- Dave mentioned we need a formal executive status slide deck for the VP review on Thursday Oct 30. Dave will draft this by Wednesday noon.`,
  },
  {
    id: 'steering-committee-budget-risk',
    title: 'ERP Rollout Steering Committee',
    badge: 'Material Risks & Decisions',
    description: 'High-stakes executive update with budget overrun risk, scope approval, and missing resource allocation.',
    projectContext: 'Enterprise ERP Modernization - Wave 2',
    meetingDate: 'October 25, 2026',
    audience: 'Executive Steering Committee & Department Heads',
    rawNotes: `Meeting: ERP Steering Committee - Monthly Gate Review
Attendees: David Chen (CFO), Priya Nair (VP Operations), Tom Bradley (Integration Partner Lead), Maria Santos (Change Mgmt), Julian Frost (PM)

Key Discussions & Decisions:
- Approved Change Request #14: Scope expanded to include automated warehouse barcoding for the Atlanta fulfillment center. Budget impact: +$145,000.
- MATERIAL RISK RAISED: Tom Bradley flagged that payroll data migration from the legacy AS400 system is running 3 weeks behind schedule due to inconsistent schema mappings. If unresolved by Nov 10, the entire Jan 1 go-live will be delayed by one full quarter. This cannot be ignored.
- Payroll schema remediation: Tom Bradley and the integration team committed to delivering clean payroll mock test data by Nov 7.
- User training schedule: Maria Santos will publish the revised department training calendar by Friday, Oct 31.
- Extra QA contractor staffing needed for payroll testing: CFO approved funding for 2 temporary QA analysts. Julian Frost will coordinate with Procurement to get agency contracts executed ASAP (due date: Nov 4).
- Internal communications plan for regional warehouse staff needs an assigned owner; currently unassigned. Needs to be delivered prior to training launch.
- Next steering committee review confirmed for Nov 18, 2026 at 2 PM ET.`,
  },
  {
    id: 'all-hands-informational-no-actions',
    title: 'Q3 Product Retrospective & Demo',
    badge: 'No Action Items (Informational)',
    description: 'Purely informational review where all tasks are already complete and no new follow-ups were created.',
    projectContext: 'Quarterly Product Retrospective',
    meetingDate: 'October 23, 2026',
    audience: 'All Product & Design Teams',
    rawNotes: `Q3 Product Retrospective - All-Hands Shareout
Date: October 23, 2026
Presenter: Carlos Mendez (Head of Product)

Summary of discussion:
- Carlos presented the finalized metrics for Q3: customer onboarding drop-off decreased by 18%, and monthly active users crossed 250,000.
- Design team walked through the finished design system tokens in Figma. All component libraries were published and shipped in the September release.
- Open floor discussion on remote collaboration practices and team satisfaction scores (averaged 4.6/5).
- Great feedback shared regarding cross-functional communication during the billing engine upgrade.
- Everyone celebrated the successful delivery with virtual kudos.
- No outstanding deliverables or pending follow-ups required from this session. Everyone was dismissed to enjoy their weekend!`,
  },
];
