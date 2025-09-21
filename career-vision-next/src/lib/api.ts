// API configuration and endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  PREDICTION: `${API_BASE_URL}/predict/`,
  SKILL_ANALYSIS: `${API_BASE_URL}/skill-analysis/`,
  ROADMAPS: `${API_BASE_URL}/roadmaps/`,
  QUIZ: `${API_BASE_URL}/quiz/`,
} as const;

// API helper functions
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Prediction API
export interface PredictionRequest {
  logical_quotient_rating: number;
  hackathons: number;
  coding_skills: number;
  public_speaking_points: number;
  self_learning_capability: string;
  extra_courses_did: string;
  certifications: string;
  workshops: string;
  reading_and_writing_skills: string;
  memory_capability_score: number;
  interested_subjects: string;
  interested_career_area: string;
  company_settle_in: string;
  book_interest: string;
  management_or_technical: string;
  hard_smart_work: string;
  worked_in_teams: string;
  introvert: string;
}

export interface PredictionResponse {
  predicted_role: string;
  confidence: number;
  roadmap?: {
    title: string;
    image: string;
    pdf: string;
    average_salary?: number;
    verified_by?: string;
  };
}

export async function predictJobRole(data: PredictionRequest): Promise<PredictionResponse> {
  return apiCall<PredictionResponse>(API_ENDPOINTS.PREDICTION, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Roadmap API
export interface Roadmap {
  id: number;
  title: string;
  image: string;
  pdf: string;
  average_salary?: number;
  verified_by?: string;
  created_at: string;
}

export async function getRoadmaps(): Promise<Roadmap[]> {
  return apiCall<Roadmap[]>(API_ENDPOINTS.ROADMAPS);
}

// Skill Analysis API
export interface SkillAnalysisRequest {
  current_skills: string[];
  target_role: string;
}

export interface SkillAnalysisResponse {
  skill_gaps: string[];
  recommended_resources: {
    title: string;
    url: string;
    type: string;
    is_free: boolean;
    provider?: string;
  }[];
  match_percentage: number;
}

export async function analyzeSkills(data: SkillAnalysisRequest): Promise<SkillAnalysisResponse> {
  return apiCall<SkillAnalysisResponse>(API_ENDPOINTS.SKILL_ANALYSIS, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}