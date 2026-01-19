
export interface MetaMetric {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface AIRecommendation {
  type: 'scaling' | 'reduction' | 'creative' | 'targeting';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action: string;
}

export interface AnalysisResult {
  summary: string;
  recommendations: AIRecommendation[];
  score: number; // Optimization score 0-100
}

export interface AdAccount {
  id: string;
  name: string;
  account_id: string;
}

export interface MetaConnection {
  accessToken: string;
  adAccountId: string;
  accountName?: string;
}
