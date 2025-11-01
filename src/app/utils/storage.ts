import { QuestionnaireResponse, QuestionnaireResult } from "@/types/questionnaire";

const STORAGE_KEY = "questionnaire_responses";
const HISTORY_KEY = "questionnaire_history";
//Fonction pour sauvegarder les reponses
export const saveResponses = (responses: QuestionnaireResponse): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  } catch (error) {
    console.error("Failed to save responses:", error);
  }
};
//Fonction pour load les reponses
export const loadResponses = (): QuestionnaireResponse => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Failed to load responses:", error);
    return {};
  }
};
//Fonction pour delete
export const clearResponses = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear responses:", error);
  }
};

export const saveToHistory = (result: QuestionnaireResult): void => {
  try {
    const history = getHistory();
    history.unshift(result);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save to history:", error);
  }
};

export const getHistory = (): QuestionnaireResult[] => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
};


