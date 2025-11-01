<<<<<<< HEAD
import { QuestionnaireResponse, QuestionnaireResult } from "@/types/questionnaire";

const STORAGE_KEY = "questionnaire_responses";
const HISTORY_KEY = "questionnaire_history";
//Fonction pour sauvegarder les reponses
=======
//  On importe les types utilisés pour typer les données du questionnaire
// - QuestionnaireResponse : les réponses données par l'utilisateur
// - QuestionnaireResult : le résultat final d'un questionnaire
import { QuestionnaireResponse, QuestionnaireResult } from "@/app/types/questionnaire";

//  Clés utilisées pour stocker les données dans le localStorage du navigateur
const STORAGE_KEY = "questionnaire_responses"; // pour les réponses actuelles
const HISTORY_KEY = "questionnaire_history";   // pour l’historique des anciens résultats

/**
 *  saveResponses()
 * Enregistre les réponses actuelles de l'utilisateur dans le localStorage
 */
>>>>>>> c1d8100897f7ab14b9337c15c5797d88fc008318
export const saveResponses = (responses: QuestionnaireResponse): void => {
  try {
    // On convertit les réponses en JSON (format texte) et on les sauvegarde
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement des réponses :", error);
  }
};
<<<<<<< HEAD
//Fonction pour load les reponses
=======

/**
 *  loadResponses()
 * Récupère les réponses sauvegardées depuis le localStorage
 */
>>>>>>> c1d8100897f7ab14b9337c15c5797d88fc008318
export const loadResponses = (): QuestionnaireResponse => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Si on a trouvé des réponses, on les transforme en objet JS, sinon on retourne un objet vide
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("❌ Erreur lors du chargement des réponses :", error);
    return {};
  }
};
<<<<<<< HEAD
//Fonction pour delete
=======

/**
 * clearResponses()
 * Supprime les réponses enregistrées du localStorage
 */
>>>>>>> c1d8100897f7ab14b9337c15c5797d88fc008318
export const clearResponses = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression des réponses :", error);
  }
};

/**
 *  saveToHistory()
 * Ajoute un nouveau résultat de questionnaire dans l’historique
 */
export const saveToHistory = (result: QuestionnaireResult): void => {
  try {
    const history = getHistory(); // On récupère l’historique existant
    history.unshift(result);      // On ajoute le nouveau résultat au début du tableau
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); // On sauvegarde le tout
  } catch (error) {
    console.error("❌ Erreur lors de l’enregistrement dans l’historique :", error);
  }
};

/**
 *  getHistory()
 * Charge l’historique complet des anciens résultats depuis le localStorage
 */
export const getHistory = (): QuestionnaireResult[] => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    // Si l’historique existe, on le renvoie en objet, sinon un tableau vide
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("❌ Erreur lors du chargement de l’historique :", error);
    return [];
  }
};

<<<<<<< HEAD

=======
/**
 *  getHistoryItem()
 * Récupère un seul résultat d’historique grâce à son id
 */
export const getHistoryItem = (id: string): QuestionnaireResult | null => {
  try {
    const history = getHistory(); // On récupère tous les résultats
    // On cherche celui qui correspond à l’id demandé
    return history.find((item) => item.id === id) || null;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération d’un élément de l’historique :", error);
    return null;
  }
};
>>>>>>> c1d8100897f7ab14b9337c15c5797d88fc008318
