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

// Helper functions améliorées pour des scores plus réalistes
const getExperienceValue = (exp: string): number => {
  const values: Record<string, number> = {
    "junior": 30,
    "intermediate": 60, 
    "senior": 85,
    "expert": 95
  };
  return values[exp] || 50;
};

const getSpecializationValue = (spec: string): number => {
  const values: Record<string, number> = {
    "frontend": 80,
    "backend": 80,
    "fullstack": 90,
    "mobile": 70,
    "devops": 75
  };
  return values[spec] || 70;
};

// Fonction pour calculer le score basé sur les technologies
const calculateTechScore = (technologies: string[], maxScore: number): number => {
  if (technologies.length === 0) return 20; // Score minimum si aucune techno
  
  const baseScore = Math.min(technologies.length * 15, maxScore);
  // Bonus si plusieurs technologies maîtrisées
  const bonus = technologies.length > 3 ? 15 : 0;
  
  return Math.min(baseScore + bonus, maxScore);
};

// Fonction principale CORRIGÉE - NE CALCULE PLUS LE SCORE TOTAL
export const generateChartData = (responses: any) => {
  console.log("📊 Génération des graphiques avec:", responses);
  
  // Récupération des réponses avec valeurs par défaut
  const specialization = responses?.q3?.answer || "fullstack";
  const experience = responses?.q2?.answer || "intermediate";
  const frontendFrameworks = responses?.q4?.answer || [];
  const backendLanguages = responses?.q7?.answer || [];
  const databases = responses?.q8?.answer || [];
  const devTools = responses?.q10?.answer || [];
  const projectType = responses?.q14?.answer || "product";

  console.log("🔍 Données extraites:", {
    specialization,
    experience,
    frontendFrameworks,
    backendLanguages,
    databases,
    devTools,
    projectType
  });

  // CALCULS DE SCORE RÉALISTES POUR LES GRAPHIQUES SEULEMENT
  const frontendScore = calculateTechScore(frontendFrameworks, 80);
  const backendScore = calculateTechScore(backendLanguages, 80);
  const databaseScore = calculateTechScore(databases, 60);
  const toolsScore = calculateTechScore(devTools, 70);
  const experienceScore = getExperienceValue(experience);
  const specializationScore = getSpecializationValue(specialization);

  // Données RADAR avec scores réalistes
  const radarData: RadarData[] = [
    { subject: "Frontend", A: frontendScore, fullMark: 100 },
    { subject: "Backend", A: backendScore, fullMark: 100 },
    { subject: "Bases de données", A: databaseScore, fullMark: 100 },
    { subject: "Outils DevOps", A: toolsScore, fullMark: 100 },
    { subject: "Expérience", A: experienceScore, fullMark: 100 },
  ];

  // Données PIE (camembert) - spécialisation avec scores variés
  const pieData: ChartData[] = [
    { 
      name: "Frontend", 
      value: specialization === "frontend" ? 80 : specialization === "fullstack" ? 40 : 15, 
      fill: "#8884d8" 
    },
    { 
      name: "Backend", 
      value: specialization === "backend" ? 80 : specialization === "fullstack" ? 40 : 15, 
      fill: "#82ca9d" 
    },
    { 
      name: "Fullstack", 
      value: specialization === "fullstack" ? 90 : 20, 
      fill: "#ffc658" 
    },
    { 
      name: "Mobile", 
      value: specialization === "mobile" ? 75 : 10, 
      fill: "#ff7300" 
    },
    { 
      name: "DevOps", 
      value: specialization === "devops" ? 70 : 5, 
      fill: "#0088FE" 
    },
  ].filter(item => item.value > 5); // Filtre les valeurs trop basses

  console.log("🎯 DONNÉES GRAPHIQUES CALCULÉES:");
  console.log("📈 Radar data:", radarData);
  console.log("🥧 Pie data:", pieData);

  // ⚠️ SUPPRIME le calcul du score total - on utilise celui du serveur
  return {
    radarData,
    pieData,
    // ⚠️ NE RETOURNE PLUS totalScore - on utilise session.totalScore
    totalMaxScore: 100 // Pour l'affichage seulement
  };
};