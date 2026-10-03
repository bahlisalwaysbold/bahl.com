export type LeadInput = {
  name: string; phone: string; email?: string; role: string; organization?: string;
  projectType: string; floors: number; drawingNeeds: string[]; deadline: string; location: string;
  hasFiles: boolean; budget?: string; notes?: string; source?: string; referrer?: string;
  serviceConsent: boolean; marketingOptIn: boolean; filePath?: string;
};
export type ScopeEstimate = { level: 'Light' | 'Standard' | 'Complex'; score: number; summary: string; recommendedPackage: string[]; nextStep: string; };

export const leadEngineConfig = {
  slug: 'structural-detailing',
  title: 'Structural detailing',
  division: 'Bahl Engineering',
  drawingOptions: [
    { id: 'reinforcement', label: 'Reinforcement drawings / schedules', weight: 18 },
    { id: 'shop', label: 'Shop / fabrication drawings', weight: 16 },
    { id: 'as-built', label: 'As-built drawings', weight: 12 },
    { id: 'coordination', label: 'Drawing coordination / revisions', weight: 10 },
  ],
  deadlineOptions: [
    { id: 'urgent', label: 'Within 72 hours', weight: 24 },
    { id: 'week', label: 'Within 7 days', weight: 18 },
    { id: 'month', label: 'Within 2–4 weeks', weight: 10 },
    { id: 'flexible', label: 'More than 4 weeks / flexible', weight: 4 },
  ],
  whatsappIntro: 'Hi Bahl, I just completed the structural detailing scope planner.',
};

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return '234' + digits.slice(1);
  return digits;
}
export function buildWhatsAppUrl(phone: string, reference: string) {
  const number = normalizePhone(phone);
  if (!number) return null;
  const text = leadEngineConfig.whatsappIntro + '\nReference: ' + reference + '\nI would like to discuss my project and next steps.';
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
}
export function estimateScope(input: Pick<LeadInput, 'floors' | 'drawingNeeds' | 'deadline' | 'hasFiles'>): ScopeEstimate {
  const floors = Math.max(1, Math.min(60, Number(input.floors) || 1));
  const drawingWeight = input.drawingNeeds.reduce((sum, id) => sum + (leadEngineConfig.drawingOptions.find((option) => option.id === id)?.weight ?? 0), 0);
  const deadlineWeight = leadEngineConfig.deadlineOptions.find((option) => option.id === input.deadline)?.weight ?? 0;
  const floorWeight = floors <= 2 ? 6 : floors <= 5 ? 14 : floors <= 10 ? 24 : 32;
  const fileWeight = input.hasFiles ? 0 : 8;
  const score = Math.min(100, floorWeight + drawingWeight + deadlineWeight + fileWeight);
  const level: ScopeEstimate['level'] = score < 38 ? 'Light' : score < 68 ? 'Standard' : 'Complex';
  const recommendedPackage = input.drawingNeeds.length
    ? leadEngineConfig.drawingOptions.filter((option) => input.drawingNeeds.includes(option.id)).map((option) => option.label)
    : ['Project review and detailing scope definition'];
  const summary = level === 'Light'
    ? 'A relatively focused detailing package with a smaller coordination load.'
    : level === 'Standard'
      ? 'A normal multi-part detailing package that will benefit from early drawing review.'
      : 'A higher-coordination package where scope, references and revision control should be agreed before production.';
  const nextStep = input.hasFiles
    ? 'Bahl can review the supplied drawings and confirm the exact production scope.'
    : 'Send the available architectural / structural files so Bahl can confirm scope before quoting.';
  return { level, score, summary, recommendedPackage, nextStep };
}
export function scoreLead(input: LeadInput) {
  let score = 20;
  if (['engineer', 'contractor', 'architect', 'developer'].includes(input.role)) score += 18;
  if (input.floors >= 3) score += 10;
  if (input.floors >= 6) score += 8;
  score += Math.min(16, input.drawingNeeds.length * 4);
  if (input.hasFiles) score += 8;
  if (input.deadline === 'urgent') score += 15;
  if (input.deadline === 'week') score += 11;
  if (input.location.trim()) score += 4;
  if (input.organization?.trim()) score += 5;
  return Math.min(100, score);
}
