// app/utils/chartData.ts

// Interfaces pour les données des graphiques
export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

// ====================================================================
// IMPORTATION DIRECTE - PAS DE RÉPÉTITION
// ====================================================================
import { ScoreCalculatorService } from '@/app/(backend)/services/score/scoreCalculatorService';

const scoreCalculator = new ScoreCalculatorService();

// ====================================================================
// FONCTIONS SPÉCIFIQUES AUX GRAPHIQUES (uniquement le visuel)
// ====================================================================

/**
 * Calcule les scores POUR L'AFFICHAGE seulement (pas pour le score total)
 */
const calculateVisualScore = (technologies: string[], maxScore: number): number => {
  if (!technologies || technologies.length === 0) return 25;
  
  const baseScore = Math.min(technologies.length * 12, maxScore);
  const bonus = technologies.length >= 3 ? 10 : 0;
  return Math.min(baseScore + bonus, maxScore);
};

const getExperienceVisualValue = (exp: string): number => {
  const values: Record<string, number> = {
    "junior": 30,
    "intermediate": 60, 
    "senior": 85,
    "expert": 95
  };
  return values[exp] || 50;
};

// ====================================================================
// FONCTION PRINCIPALE OPTIMISÉE
// ====================================================================
export const generateChartData = (responses: any) => {

  // Récupération des réponses
  const specialization = responses?.q3?.answer || "fullstack";
  const experience = responses?.q2?.answer || "intermediate";
  const frontendFrameworks = responses?.q4?.answer || [];
  const backendLanguages = responses?.q7?.answer || [];
  const databases = responses?.q8?.answer || [];
  const devTools = responses?.q10?.answer || [];

  // ⚠️ CALCUL DU SCORE RÉEL (utilise la même logique que MongoDB)
  const realScore = scoreCalculator.calculateTotalScore(responses);
  
  console.log("🔍 Données pour graphiques:", {
    specialization,
    experience,
    frontendCount: frontendFrameworks.length,
    backendCount: backendLanguages.length,
    scoreRéel: realScore
  });

  // CALCULS VISUELS POUR GRAPHIQUES (uniquement l'affichage)
  const radarData: RadarData[] = [
    { subject: "Frontend", A: calculateVisualScore(frontendFrameworks, 80), fullMark: 100 },
    { subject: "Backend", A: calculateVisualScore(backendLanguages, 80), fullMark: 100 },
    { subject: "Bases de données", A: calculateVisualScore(databases, 60), fullMark: 100 },
    { subject: "Outils DevOps", A: calculateVisualScore(devTools, 70), fullMark: 100 },
    { subject: "Expérience", A: getExperienceVisualValue(experience), fullMark: 100 },
  ];

  // Données PIE - spécialisation
  const pieData: ChartData[] = [
    { name: "Frontend", value: specialization === "frontend" ? 80 : specialization === "fullstack" ? 40 : 15, fill: "#8884d8" },
    { name: "Backend", value: specialization === "backend" ? 80 : specialization === "fullstack" ? 40 : 15, fill: "#82ca9d" },
    { name: "Fullstack", value: specialization === "fullstack" ? 90 : 20, fill: "#ffc658" },
    { name: "Mobile", value: specialization === "mobile" ? 75 : 10, fill: "#ff7300" },
    { name: "DevOps", value: specialization === "devops" ? 70 : 5, fill: "#0088FE" },
  ].filter(item => item.value > 5);

  return {
    radarData,
    pieData,
    realScore,
    totalMaxScore: 100 
  };
};