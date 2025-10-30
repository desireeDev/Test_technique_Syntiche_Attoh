import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ProgressBar } from "@/app/components/ui/progress-bar";
import { RadioGroupCard } from "@/app/components/ui/radio-group-card";
import { CheckboxGroupCard } from "@/app/components/ui/checkbox-group-card";

import { questionnaireSteps } from "@/app/data/questions";
import { Question, QuestionnaireResponse, Step } from "@/app/types/questionnaire";
import { saveResponses, loadResponses, clearResponses, saveToHistory } from "@/app/utils/storage";
import { validateStep, shouldShowQuestion } from "@/app/utils/validation";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const Questionnaire = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [responses, setResponses] = useState<QuestionnaireResponse>({});
  const [direction, setDirection] = useState<number>(1);

  // Charger les réponses sauvegardées
  useEffect(() => {
    const saved = loadResponses();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResponses(saved);
  }, []);

  // Sauvegarder les réponses à chaque modification
  useEffect(() => {
    saveResponses(responses);
  }, [responses]);

  const step: Step = questionnaireSteps[currentStep];
  const isLastStep = currentStep === questionnaireSteps.length - 1;

  // Filtrer les questions visibles selon les réponses précédentes
  const visibleQuestions: Question[] = step.questions.filter((q: Question) =>
    shouldShowQuestion(q, responses)
  );

  const canProceed = validateStep(visibleQuestions, responses);

  const handleNext = () => {
    if (!canProceed) {
      toast.error("Veuillez répondre à toutes les questions obligatoires");
      return;
    }

    if (isLastStep) {
      handleComplete();
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const result = {
      id: Date.now().toString(),
      date: new Date(),
      responses,
      completedAt: new Date(),
    };

    saveToHistory(result);
    clearResponses();
    toast.success("Questionnaire complété !");
    navigate(`/results/${result.id}`);
  };

  const updateResponse = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <ProgressBar current={currentStep + 1} total={questionnaireSteps.length} />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <Card className="p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
                {step.description && <p className="text-muted-foreground">{step.description}</p>}
              </div>

              <div className="space-y-8">
                {visibleQuestions.map((question: Question) => (
                  <div key={question.id} className="space-y-3">
                    <label className="text-lg font-semibold block">
                      {question.text}
                      {question.required && <span className="text-destructive ml-1">*</span>}
                    </label>

                    {question.type === "radio" && question.options && (
                      <RadioGroupCard
                        options={question.options}
                        value={(responses[question.id] as string) || ""}
                        onChange={value => updateResponse(question.id, value)}
                      />
                    )}

                    {question.type === "checkbox" && question.options && (
                      <CheckboxGroupCard
                        options={question.options}
                        values={(responses[question.id] as string[]) || []}
                        onChange={value => updateResponse(question.id, value)}
                      />
                    )}

                    {question.type === "text" && (
                      <Input
                        value={(responses[question.id] as string) || ""}
                        onChange={e => updateResponse(question.id, e.target.value)}
                        placeholder={question.placeholder || "Tapez votre réponse ici..."}
                        className="text-base"
                      />
                    )}

                    {question.type === "textarea" && (
                      <Textarea
                        value={(responses[question.id] as string) || ""}
                        onChange={e => updateResponse(question.id, e.target.value)}
                        placeholder={question.placeholder || "Tapez votre réponse ici..."}
                        className="text-base min-h-[120px]"
                        maxLength={question.validation?.maxLength}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button variant="outline" size="lg" onClick={handlePrevious} disabled={currentStep === 0}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Précédent
          </Button>

          <Button size="lg" onClick={handleNext} disabled={!canProceed} className="bg-primary hover:bg-primary/90">
            {isLastStep ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Terminer
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
