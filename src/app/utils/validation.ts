// Importation des types utilisés :
// - Question : représente la structure d’une question (texte, type, validation, etc.)
// - QuestionnaireResponse : représente les réponses données par l’utilisateur
import { Question, QuestionnaireResponse } from "@/app/types/questionnaire";


// 🔍 Fonction : validateQuestion
// ------------------------------------------------------------
// Objectif : vérifier si une réponse donnée est valide
// en fonction des contraintes de la question (obligatoire, longueur, nombre de sélections, etc.)
export const validateQuestion = (
  question: Question,
  value: string | string[] | undefined // la valeur peut être une chaîne, un tableau ou indéfinie
): boolean => {

  // Si la question n’est pas obligatoire, aucune validation n’est nécessaire
  if (!question.required) return true;
  
  // Si aucune valeur n’a été fournie pour une question obligatoire → invalide
  if (!value) return false;
  
  // ✅ CAS 1 : la réponse est un tableau (par ex. cases à cocher)
  if (Array.isArray(value)) {
    // Tableau vide → invalide
    if (value.length === 0) return false;
    // Vérifie le nombre minimum de sélections
    if (question.minSelections && value.length < question.minSelections) return false;
    // Vérifie le nombre maximum de sélections
    if (question.maxSelections && value.length > question.maxSelections) return false;
    // Toutes les conditions sont respectées
    return true;
  }
  
  // ✅ CAS 2 : la réponse est une chaîne (par ex. champ texte ou choix unique)
  if (typeof value === 'string') {
    // Chaîne vide ou uniquement des espaces → invalide
    if (value.trim() === "") return false;
    // Vérifie la longueur minimale si spécifiée
    if (question.validation?.minLength && value.length < question.validation.minLength) return false;
    // Vérifie la longueur maximale si spécifiée
    if (question.validation?.maxLength && value.length > question.validation.maxLength) return false;
    // Tout est conforme
    return true;
  }
  
  // Si aucun des cas ne correspond → invalide
  return false;
};


// 🔍 Fonction : validateStep
// ------------------------------------------------------------
// Objectif : vérifier si TOUTES les questions d’une étape sont valides
// en fonction des réponses et des conditions d’affichage.
export const validateStep = (
  questions: Question[],                // Liste des questions de l’étape
  responses: QuestionnaireResponse      // Réponses actuelles de l’utilisateur
): boolean => {

  // every() → renvoie true uniquement si TOUTES les questions sont valides
  return questions.every((question) => {

    // ⚙️ Gestion des questions conditionnelles
    if (question.conditionalOn) {
      // Récupère la valeur de la question dont dépend celle-ci
      const conditionalValue = responses[question.conditionalOn.questionId];

      // Vérifie si la question doit être affichée selon la valeur conditionnelle
      const shouldShow = question.conditionalOn.values.some((val) => {
        if (Array.isArray(conditionalValue)) {
          // Si la valeur conditionnelle est un tableau → vérifie si elle contient "val"
          return conditionalValue.includes(val);
        }
        // Sinon, compare directement la valeur
        return conditionalValue === val;
      });

      // Si la condition n’est pas remplie, on ignore cette question (considérée valide)
      if (!shouldShow) return true;
    }

    // Valide la question normalement
    return validateQuestion(question, responses[question.id]);
  });
};


// 🔍 Fonction : shouldShowQuestion
// ------------------------------------------------------------
// Objectif : déterminer si une question doit être affichée ou non
// en fonction d’une autre réponse conditionnelle.
export const shouldShowQuestion = (
  question: Question,
  responses: QuestionnaireResponse
): boolean => {

  // Si aucune condition n’est définie → la question est toujours affichée
  if (!question.conditionalOn) return true;
  
  // Récupère la valeur de la question dont dépend celle-ci
  const conditionalValue = responses[question.conditionalOn.questionId];

  // Vérifie si la valeur actuelle correspond à une des valeurs déclencheuses
  return question.conditionalOn.values.some((val) => {
    if (Array.isArray(conditionalValue)) {
      // Si la valeur est un tableau (ex: plusieurs réponses possibles)
      return conditionalValue.includes(val);
    }
    // Sinon, comparaison directe
    return conditionalValue === val;
  });
};
