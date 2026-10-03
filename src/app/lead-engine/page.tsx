import type { Metadata } from 'next';
import LeadEngineClient from './LeadEngineClient';

export const metadata: Metadata = {
  title: 'Structural detailing scope planner',
  description: 'Plan your structural detailing scope, share your project requirements and request a review from Bahl Engineering.',
};

export default function LeadEnginePage() {
  return <LeadEngineClient />;
}
