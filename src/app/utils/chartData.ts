// app/utils/chartData.ts

// Interfaces simplifiées
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

// Helper functions  pour generate Chart Data
const getExperienceValue = (exp: string): number => {
  const values: Record<string, number> = {
    "junior": 1,
    "intermediate": 2, 
    "senior": 3,
    "expert": 4
  };
  return values[exp] || 1;
};

const getSpecializationValue = (spec: string): number => {
  const values: Record<string, number> = {
    "frontend": 3,
    "backend": 3,
    "fullstack": 4,
    "mobile": 2,
    "devops": 2
  };
  return values[spec] || 3;
};

// Fonction principale simplifiée
export const generateChartData = (responses: any) => {
  console.log("📊 Génération des graphiques avec:", responses);
  
  // Récupération des réponses avec valeurs par défaut
  const specialization = responses?.q3?.answer || "fullstack";
  const experience = responses?.q2?.answer || "intermediate";
  const frontendFrameworks = responses?.q4?.answer || [];
  const backendLanguages = responses?.q7?.answer || [];
  const projectType = responses?.q14?.answer || "product";

  console.log("🔍 Données extraites:", {
    specialization,
    experience,
    frontendFrameworks,
    backendLanguages,
    projectType
  });

  // Données RADAR simplifiées (format Recharts)
  const radarData: RadarData[] = [
    { subject: "Frontend", A: frontendFrameworks.length * 15, fullMark: 60 },
    { subject: "Backend", A: backendLanguages.length * 15, fullMark: 60 },
    { subject: "Expérience", A: getExperienceValue(experience) * 15, fullMark: 60 },
    { subject: "Spécialisation", A: getSpecializationValue(specialization) * 15, fullMark: 60 },
    { subject: "Outils", A: 30, fullMark: 60 },
  ];

  // Données PIE (camembert) - spécialisation
  const pieData: ChartData[] = [
    { name: "Frontend", value: specialization === "frontend" ? 100 : 20, fill: "#8884d8" },
    { name: "Backend", value: specialization === "backend" ? 100 : 20, fill: "#82ca9d" },
    { name: "Fullstack", value: specialization === "fullstack" ? 100 : 20, fill: "#ffc658" },
    { name: "Mobile", value: specialization === "mobile" ? 100 : 20, fill: "#ff7300" },
  ].filter(item => item.value > 0); // Filtre les valeurs nulles

  console.log("📈 Radar data:", radarData);
  console.log("🥧 Pie data:", pieData);

  return {
    radarData,
    pieData,
    totalScore: radarData.reduce((sum, item) => sum + item.A, 0),
    totalMaxScore: 300
  };
};