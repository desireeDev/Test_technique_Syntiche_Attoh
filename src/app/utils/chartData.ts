import { QuestionnaireResponse } from "@/app/types/questionnaire";

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface RadarData {
  category: string;
  score: number;
  fullMark: number;
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
}

const getExperienceScore = (experience: string): number => {
  const scores: Record<string, number> = {
    junior: 1,
    intermediate: 2,
    senior: 3,
    expert: 4,
  };
  return scores[experience] || 0;
};

const getSpecializationScore = (spec: string): number => {
  const scores: Record<string, number> = {
    frontend: 10,
    backend: 20,
    fullstack: 30,
    mobile: 40,
    devops: 50,
  };
  return scores[spec] || 0;
};

export const generateChartData = (responses: QuestionnaireResponse) => {
  const specialization = responses.q3 as string;
  const experience = responses.q2 as string;
  const frontendFrameworks = (responses.q4 || []) as string[];
  const metaFramework = responses.q5 as string;
  const stylingTools = (responses.q6 || []) as string[];
  const backendLanguages = (responses.q7 || []) as string[];
  const databases = (responses.q8 || []) as string[];
  const apiPreference = responses.q9 as string;
  const devTools = (responses.q10 || []) as string[];
  const testingPractices = (responses.q11 || []) as string[];
  const typescriptApproach = responses.q12 as string;
  const interests = (responses.q13 || []) as string[];
  const projectType = responses.q14 as string;

  // Calcul des scores par catégorie
  const experienceScore = getExperienceScore(experience) * 7.5; // Max 30
  const frontendScore = frontendFrameworks.length * 5 + stylingTools.length * 3; // Max ~40
  const backendScore = backendLanguages.length * 5 + databases.length * 4; // Max ~35
  const toolsScore = devTools.length * 2 + testingPractices.length * 4; // Max ~25
  const goalsScore = interests.length * 5 + 8; // Max ~20

  const categories: CategoryScore[] = [
    {
      name: "Expérience",
      score: experienceScore,
      maxScore: 30,
      percentage: (experienceScore / 30) * 100,
    },
    {
      name: "Frontend",
      score: Math.min(frontendScore, 40),
      maxScore: 40,
      percentage: (Math.min(frontendScore, 40) / 40) * 100,
    },
    {
      name: "Backend",
      score: Math.min(backendScore, 35),
      maxScore: 35,
      percentage: (Math.min(backendScore, 35) / 35) * 100,
    },
    {
      name: "Outils & Tests",
      score: Math.min(toolsScore, 25),
      maxScore: 25,
      percentage: (Math.min(toolsScore, 25) / 25) * 100,
    },
    {
      name: "Objectifs",
      score: Math.min(goalsScore, 20),
      maxScore: 20,
      percentage: (Math.min(goalsScore, 20) / 20) * 100,
    },
  ];

  const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);
  const totalMaxScore = categories.reduce((sum, cat) => sum + cat.maxScore, 0);

  // Données pour le radar chart
  const radarData: RadarData[] = [
    {
      category: "Frontend",
      score: Math.min(frontendScore, 40),
      fullMark: 40,
    },
    {
      category: "Backend",
      score: Math.min(backendScore, 35),
      fullMark: 35,
    },
    {
      category: "DevOps/Outils",
      score: Math.min(toolsScore, 25),
      fullMark: 25,
    },
    {
      category: "Testing",
      score: testingPractices.length * 4,
      fullMark: 20,
    },
    {
      category: "Architecture",
      score: interests.includes("architecture") ? 15 : interests.includes("performance") ? 12 : 8,
      fullMark: 15,
    },
  ];

  // Données pour les préférences de projet
  const projectPreferences: ChartData[] = [
    { name: "Startup", value: projectType === "startup" ? 100 : 20, color: "#8B5CF6" },
    { name: "SaaS", value: projectType === "product" ? 100 : 20, color: "#6366F1" },
    { name: "Agence", value: projectType === "agency" ? 100 : 20, color: "#EC4899" },
    { name: "Open Source", value: projectType === "open-source" ? 100 : 20, color: "#10B981" },
    { name: "Enterprise", value: projectType === "enterprise" ? 100 : 20, color: "#F59E0B" },
  ];

  return {
    roleData: [
      { name: "Frontend", value: specialization === "frontend" ? 100 : 0, color: "#8B5CF6" },
      { name: "Backend", value: specialization === "backend" ? 100 : 0, color: "#EC4899" },
      { name: "Full-Stack", value: specialization === "fullstack" ? 100 : 0, color: "#10B981" },
      { name: "Mobile", value: specialization === "mobile" ? 100 : 0, color: "#F59E0B" },
      { name: "DevOps", value: specialization === "devops" ? 100 : 0, color: "#3B82F6" },
    ].filter((item) => item.value > 0),

    experienceData: [
      { name: experience || "N/A", value: getExperienceScore(experience) * 25, color: "#6366F1" },
    ],

    technologiesData: [
      ...frontendFrameworks.map((tech) => ({
        name: tech,
        value: 1,
        color: "#8B5CF6",
      })),
      ...backendLanguages.map((tech) => ({
        name: tech,
        value: 1,
        color: "#10B981",
      })),
    ],

    categories,
    totalScore,
    totalMaxScore,
    radarData,
    projectPreferences,
  };
};
