"use client"; // Indique à Next.js que ce composant doit être rendu côté client

import { useState, useEffect } from "react"; // Hooks React pour la gestion d'état et effets
import { useRouter } from "next/navigation"; // Hook Next.js pour naviguer entre les pages
import { motion, AnimatePresence } from "framer-motion"; // Pour les animations

// Composants UI réutilisables
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ProgressBar } from "@/app/components/ui/progress-bar";
import { RadioGroupCard } from "@/app/components/ui/radio-group-card";
import { CheckboxGroupCard } from "@/app/components/ui/checkbox-group-card";

// Types TypeScript
import { Question, Step, QuestionnaireResponse } from "@/app/types/questionnaire";

// Fonctions utilitaires pour la persistance des réponses
import { saveResponses, loadResponses, clearResponses, saveToHistory } from "@/app/utils/storage";
import { validateStep, shouldShowQuestion } from "@/app/utils/validation";

// Icônes et notifications
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

// Composant principal du questionnaire
export default function Questionnaire() {
  const router = useRouter(); // Hook pour naviguer
  const [questionnaireSteps, setQuestionnaireSteps] = useState<Step[]>([]); // Stocke les étapes du questionnaire
  const [currentStep, setCurrentStep] = useState(0); // Étape actuelle
  const [responses, setResponses] = useState<QuestionnaireResponse>({}); // Réponses de l'utilisateur
  const [direction, setDirection] = useState(1); // Direction pour l'animation (1 = next, -1 = prev)
  const [loading, setLoading] = useState(true); // État de chargement des questions

  // ----------- FETCH DES QUESTIONS DE L'API -----------
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions"); // Appel à l'API
        if (!res.ok) throw new Error("Impossible de récupérer les questions");
        const data = await res.json();
        setQuestionnaireSteps(data.steps); // On stocke les étapes récupérées
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des questions");
      } finally {
        setLoading(false); // Fin du chargement
      }
    };
    fetchQuestions();
  }, []);

  // ----------- CHARGEMENT DES RÉPONSES SAUVEGARDÉES -----------
  useEffect(() => {
    const saved = loadResponses(); // Charger depuis le localStorage
    setResponses(saved);
  }, []);

  // Sauvegarder automatiquement les réponses à chaque modification
  useEffect(() => {
    saveResponses(responses);
  }, [responses]);

  // ----------- GESTION DU LOADING ET DU CAS VIDE -----------
  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (questionnaireSteps.length === 0) return <div className="text-center py-20">Aucune question disponible</div>;

  // ----------- VARIABLES DE L'ÉTAPE ACTUELLE -----------
  const step: Step = questionnaireSteps[currentStep]; // Étape actuelle
  const isLastStep = currentStep === questionnaireSteps.length - 1; // Vérifie si c'est la dernière étape
  const visibleQuestions = step.questions.filter(q => shouldShowQuestion(q, responses)); // Filtre les questions visibles
  const canProceed = validateStep(visibleQuestions, responses); // Vérifie si toutes les questions obligatoires sont remplies

  // ----------- GESTION DES BOUTONS PRÉCÉDENT / SUIVANT -----------
  const handleNext = () => {
    if (!canProceed) {
      toast.error("Veuillez répondre à toutes les questions obligatoires");
      return;
    }
    if (isLastStep) return handleComplete(); // Si dernière étape, compléter le questionnaire
    setDirection(1);
    setCurrentStep(prev => prev + 1); // Passer à l'étape suivante
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1); // Revenir à l'étape précédente
    }
  };

  // ----------- COMPLÉTER LE QUESTIONNAIRE -----------
  const handleComplete = async () => {
    try {
      const sessionData = {
        sessionId: Date.now().toString(),
        responses,
        progress: { currentStep: currentStep + 1, totalSteps: questionnaireSteps.length, completedSteps: [] },
      };
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi des réponses");
      const result = await res.json();
      saveToHistory({
          ...sessionData, completedAt: new Date(),
          id: "",
          date: new Date()
      }); // Historique local
      clearResponses(); // Nettoyer le localStorage
      toast.success("Questionnaire complété !");
      router.push(`/results/${sessionData.sessionId}`); // Redirection vers la page des résultats
    } catch (err) {
      console.error(err);
      toast.error("Impossible de sauvegarder vos réponses");
    }
  };

  // Mettre à jour une réponse pour une question
  const updateResponse = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // Variants pour l'animation des étapes
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0 }),
  };

  // ----------- RENDER -----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Barre de progression */}
        <ProgressBar current={currentStep + 1} total={questionnaireSteps.length} />

        {/* Animation de l'étape */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          >
            <Card className="p-8 shadow-xl">
              {/* Titre et description de l'étape */}
              <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
              {step.description && <p className="text-muted-foreground mb-6">{step.description}</p>}

              {/* Questions */}
              <div className="space-y-8">
                {visibleQuestions.map(q => (
                  <div key={q.id} className="space-y-3">
                    <label className="text-lg font-semibold block">
                      {q.text} {q.required && <span className="text-destructive ml-1">*</span>}
                    </label>

                    {/* Types de questions */}
                    {q.type === "radio" && q.options && (
                      <RadioGroupCard options={q.options} value={(responses[q.id] as string) || ""} onChange={v => updateResponse(q.id, v)} />
                    )}
                    {q.type === "checkbox" && q.options && (
                      <CheckboxGroupCard options={q.options} values={(responses[q.id] as string[]) || []} onChange={v => updateResponse(q.id, v)} />
                    )}
                    {q.type === "text" && (
                      <Input value={(responses[q.id] as string) || ""} onChange={e => updateResponse(q.id, e.target.value)} placeholder={q.placeholder || ""} />
                    )}
                    {q.type === "textarea" && (
                      <Textarea value={(responses[q.id] as string) || ""} onChange={e => updateResponse(q.id, e.target.value)} placeholder={q.placeholder || ""} />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Boutons précédent / suivant */}
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
}
