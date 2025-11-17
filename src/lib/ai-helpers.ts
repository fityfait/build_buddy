const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface AIProjectDescription {
  overview: string;
  features: string[];
  goals: string[];
  outcomes: string;
}

export interface AISkillMatch {
  matchPercentage: number;
  explanation: string;
  matchingSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
}

export interface AITaskBreakdown {
  phases: Array<{
    name: string;
    duration: string;
    tasks: string[];
  }>;
  milestones: Array<{
    name: string;
    description: string;
  }>;
  recommendations: string[];
}

export async function generateProjectDescription(idea: string): Promise<AIProjectDescription> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-describe-project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate project description');
  }

  return response.json();
}

export async function calculateSkillMatch(
  projectSkills: string[],
  studentSkills: string[]
): Promise<AISkillMatch> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-match-skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectSkills, studentSkills }),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate skill match');
  }

  return response.json();
}

export async function generateTaskBreakdown(
  description: string,
  duration?: string
): Promise<AITaskBreakdown> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-task-breakdown`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description, duration }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate task breakdown');
  }

  return response.json();
}
