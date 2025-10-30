// app/utils/scoreCalculator.ts

/**
 * SERVICE DE CALCUL DES SCORES
 * 
 * Logique métier pour calculer le score total d'un questionnaire
 * basé sur les réponses de l'utilisateur.
 * 
 * Principes :
 * - Chaque question a un poids différent
 * - Les réponses multiples rapportent plus de points
 * - L'expérience et la spécialisation sont valorisées
 */

/**
 * Calcule le score total basé sur toutes les réponses
 * @param responses - Réponses du questionnaire
 * @returns Score total sur 100
 */
export const calculateTotalScore = (responses: Record<string, any>): number => {
  console.log("🧮 Calcul du score avec les réponses:", responses);
  
  let totalScore = 0;
  let maxPossibleScore = 0;

  // ====================================================================
  // QUESTION 1 : Nom (information, pas de score)
  // ====================================================================
  if (responses.q1?.answer) {
    // Score de base pour avoir répondu
    totalScore += 5;
  }
  maxPossibleScore += 5;

  // ====================================================================
  // QUESTION 2 : Expérience (poids important)
  // ====================================================================
  const experienceScore = calculateExperienceScore(responses.q2?.answer);
  totalScore += experienceScore;
  maxPossibleScore += 25;

  // ====================================================================
  // QUESTION 3 : Spécialisation (poids important)
  // ====================================================================
  const specializationScore = calculateSpecializationScore(responses.q3?.answer);
  totalScore += specializationScore;
  maxPossibleScore += 20;

  // ====================================================================
  // QUESTION 4 : Technologies Frontend (poids moyen)
  // ====================================================================
  const frontendScore = calculateTechStackScore(responses.q4?.answer, 15);
  totalScore += frontendScore;
  maxPossibleScore += 15;

  // ====================================================================
  // QUESTION 7 : Technologies Backend (poids moyen)
  // ====================================================================
  const backendScore = calculateTechStackScore(responses.q7?.answer, 15);
  totalScore += backendScore;
  maxPossibleScore += 15;

  // ====================================================================
  // QUESTION 8 : Bases de données (poids moyen)
  // ====================================================================
  const databaseScore = calculateTechStackScore(responses.q8?.answer, 10);
  totalScore += databaseScore;
  maxPossibleScore += 10;

  // ====================================================================
  // QUESTION 10 : Outils DevOps (poids faible)
  // ====================================================================
  const toolsScore = calculateTechStackScore(responses.q10?.answer, 5);
  totalScore += toolsScore;
  maxPossibleScore += 5;

  // ====================================================================
  // QUESTION 14 : Type de projet (poids faible)
  // ====================================================================
  const projectScore = calculateProjectScore(responses.q14?.answer);
  totalScore += projectScore;
  maxPossibleScore += 5;

  // ====================================================================
  // CALCUL FINAL ET NORMALISATION
  // ====================================================================
  
  // Score normalisé sur 100
  const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);
  
  console.log("📊 Résultat calcul score:", {
    totalScore,
    maxPossibleScore,
    normalizedScore
  });

  return Math.min(normalizedScore, 100); // Ne dépasse pas 100%
};

// ====================================================================
// FONCTIONS HELPER SPÉCIFIQUES
// ====================================================================

/**
 * Calcule le score basé sur l'expérience
 */
const calculateExperienceScore = (experience: string): number => {
  const scores: Record<string, number> = {
    "junior": 10,
    "intermediate": 18,
    "senior": 23,
    "expert": 25
  };
  return scores[experience] || 12;
};

/**
 * Calcule le score basé sur la spécialisation
 */
const calculateSpecializationScore = (specialization: string): number => {
  const scores: Record<string, number> = {
    "frontend": 16,
    "backend": 16,
    "fullstack": 20, // Bonus pour la polyvalence
    "mobile": 14,
    "devops": 15
  };
  return scores[specialization] || 12;
};

/**
 * Calcule le score pour une stack technologique
 */
const calculateTechStackScore = (technologies: string[] = [], maxScore: number): number => {
  if (!technologies || technologies.length === 0) return 0;
  
  // Score de base + bonus pour la polyvalence
  const baseScore = Math.min(technologies.length * 3, maxScore);
  const bonus = technologies.length > 2 ? 3 : 0;
  
  return Math.min(baseScore + bonus, maxScore);
};

/**
 * Calcule le score basé sur le type de projet préféré
 */
const calculateProjectScore = (projectType: string): number => {
  const scores: Record<string, number> = {
    "startup": 3,
    "product": 4,
    "agency": 2,
    "open-source": 5, // Bonus pour l'open source
    "enterprise": 3
  };
  return scores[projectType] || 2;
};