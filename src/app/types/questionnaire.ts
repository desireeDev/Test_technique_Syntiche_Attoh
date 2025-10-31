//Déclaration des types en TypeScript
export type QuestionType = "radio" | "checkbox" | "text" | "textarea";

export interface QuestionOption {
  id?: string;           // facultatif 
  label: string;         // texte affiché
  value: string;         // valeur interne
  score?: number;        // optionnel pour scoring
}

export interface Question {
  id: string;            // identifiant unique de la question
  text: string;          // texte de la question
  label?: string;        // texte court ou label alternatif
  type: QuestionType;
  options?: QuestionOption[]; // uniquement pour radio/checkbox
  required: boolean;
  placeholder?: string;
  minSelections?: number;     // pour checkbox
  maxSelections?: number;     // pour checkbox
  validation?: {
    minLength?: number;       // pour text/textarea
    maxLength?: number;
  };
  conditionalOn?: {
    questionId: string;       // ID de la question sur laquelle dépend la visibilité
    values: string[];         // valeurs qui déclenchent l'affichage
  };
}

export interface Step {
  id: string;                // identifiant unique de l'étape
  title: string;             // titre affiché de l'étape
  description?: string;      // description optionnelle
  questions: Question[];
}
//////
export interface QuestionnaireResponse {
  [questionId: string]: string | string[];  // réponses de l'utilisateur
}

export interface QuestionnaireResult {
  id: string;
  date: Date;                        // date de création du résultat
  responses: QuestionnaireResponse;  // réponses de l'utilisateur
  completedAt: Date;                 // date de complétion
}
//interface User typée
export interface User {
  id: string;
  email: string;
  name: string;
}
