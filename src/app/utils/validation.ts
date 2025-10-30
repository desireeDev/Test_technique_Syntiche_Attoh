import { Question, QuestionnaireResponse } from "@/app/types/questionnaire";

export const validateQuestion = (
  question: Question,
  value: string | string[] | undefined
): boolean => {
  if (!question.required) return true;
  
  if (!value) return false;
  
  if (Array.isArray(value)) {
    if (value.length === 0) return false;
    if (question.minSelections && value.length < question.minSelections) return false;
    if (question.maxSelections && value.length > question.maxSelections) return false;
    return true;
  }
  
  if (typeof value === 'string') {
    if (value.trim() === "") return false;
    if (question.validation?.minLength && value.length < question.validation.minLength) return false;
    if (question.validation?.maxLength && value.length > question.validation.maxLength) return false;
    return true;
  }
  
  return false;
};

export const validateStep = (
  questions: Question[],
  responses: QuestionnaireResponse
): boolean => {
  return questions.every((question) => {
    if (question.conditionalOn) {
      const conditionalValue = responses[question.conditionalOn.questionId];
      const shouldShow = question.conditionalOn.values.some((val) => {
        if (Array.isArray(conditionalValue)) {
          return conditionalValue.includes(val);
        }
        return conditionalValue === val;
      });
      if (!shouldShow) return true;
    }
    return validateQuestion(question, responses[question.id]);
  });
};

export const shouldShowQuestion = (
  question: Question,
  responses: QuestionnaireResponse
): boolean => {
  if (!question.conditionalOn) return true;
  
  const conditionalValue = responses[question.conditionalOn.questionId];
  return question.conditionalOn.values.some((val) => {
    if (Array.isArray(conditionalValue)) {
      return conditionalValue.includes(val);
    }
    return conditionalValue === val;
  });
};
