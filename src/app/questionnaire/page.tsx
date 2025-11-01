"use client"; // Indique que ce composant s'exécute côté client (nécessaire pour les hooks et interactions)

import { useState, useEffect } from "react"; // Hooks React pour gérer l'état et les effets
import { useRouter } from "next/navigation"; // Hook Next.js pour la navigation entre pages
import { motion, AnimatePresence } from "framer-motion"; // Bibliothèque d'animations
import { ArrowLeft, ArrowRight, Check } from "lucide-react"; // Icônes SVG


// Import des composants UI réutilisables
import { Button } from "@/components/Ui/button";
import { Card } from "@/components/Ui/card";
import { Input } from "@/components/Ui/input";
import { Textarea } from "@/components/Ui/textarea";
import { ProgressBar } from "@/components/Ui/progress-bar";
import { RadioGroupCard } from "@/components/Ui/radio-group-card";
import { CheckboxGroupCard } from "@/components/Ui/checkbox-group-card";

// Import des types TypeScript pour une meilleure sécurité et auto-complétion
import {  Step, QuestionnaireResponse } from "@/types/questionnaire";

// Import des fonctions utilitaires pour la gestion des données
import { saveResponses, loadResponses, clearResponses, saveToHistory } from "@/app/utils/storage";
import { validateStep, shouldShowQuestion } from "@/app/utils/validation";
import { toast } from "sonner";

/**
 * COMPOSANT PRINCIPAL DU QUESTIONNAIRE
 * 
 * Ce composant gère :
 * - Le chargement des questions depuis l'API
 * - La navigation entre les étapes
 * - La sauvegarde automatique des réponses
 * - La validation des réponses
 * - La soumission finale du questionnaire
 */
export default function Questionnaire() {
  // Initialisation du router pour la navigation
  const router = useRouter();
  
  // ÉTAT DU QUESTIONNAIRE
  const [questionnaireSteps, setQuestionnaireSteps] = useState<Step[]>([]); // Stocke toutes les étapes/questions
  const [currentStep, setCurrentStep] = useState(0); // Index de l'étape actuelle (0-based)
  const [responses, setResponses] = useState<QuestionnaireResponse>({}); // Réponses utilisateur {questionId: valeur}
  const [direction, setDirection] = useState(1); // Direction de l'animation (1 = suivant, -1 = précédent)
  const [loading, setLoading] = useState(true); // État de chargement initial

  // ========== EFFET : CHARGEMENT DES QUESTIONS DEPUIS L'API ==========
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Appel à l'endpoint API qui retourne les questions
        const res = await fetch("/api/questions");
        if (!res.ok) throw new Error("Impossible de récupérer les questions");
        
        // Conversion de la réponse en JSON
        const data = await res.json();
        
        // Mise à jour de l'état avec les étapes reçues
        setQuestionnaireSteps(data.steps);
      } catch (err) {
        // Gestion des erreurs avec notification utilisateur
        console.error(err);
        toast.error("Erreur lors du chargement des questions");
      } finally {
        // Arrêt du loading dans tous les cas (succès ou erreur)
        setLoading(false);
      }
    };
    
    // Lancement du chargement
    fetchQuestions();
  }, []); // Tableau de dépendances vide = exécuté une fois au montage

  // ========== EFFET : CHARGEMENT DES RÉPONSES SAUVEGARDÉES ==========
  useEffect(() => {
    // Récupère les réponses précédemment sauvegardées dans le localStorage
    const saved = loadResponses();
    setResponses(saved);
  }, []); // Exécuté une fois au montage

  // ========== EFFET : SAUVEGARDE AUTOMATIQUE DES RÉPONSES ==========
  useEffect(() => {
    // Sauvegarde automatique à chaque modification des réponses
    saveResponses(responses);
  }, [responses]); // Exécuté à chaque changement des réponses

  // ========== GESTION DES ÉTATS DE CHARGEMENT ==========
  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (questionnaireSteps.length === 0) return <div className="text-center py-20">Aucune question disponible</div>;

  // ========== VARIABLES DE L'ÉTAPE ACTUELLE ==========
  const step: Step = questionnaireSteps[currentStep]; // Étape courante
  const isLastStep = currentStep === questionnaireSteps.length - 1; // Vérifie si dernière étape
  const visibleQuestions = step.questions.filter(q => shouldShowQuestion(q, responses)); // Questions conditionnelles
  const canProceed = validateStep(visibleQuestions, responses); // Validation des réponses obligatoires

  // ========== GESTION DE LA NAVIGATION ==========

  /**
   * Fonction pour passer à l'étape suivante
   */
  const handleNext = () => {
    // Vérification que toutes les questions obligatoires sont remplies
    if (!canProceed) {
      toast.error("Veuillez répondre à toutes les questions obligatoires");
      return;
    }
    
    // Si dernière étape, on complète le questionnaire
    if (isLastStep) return handleComplete();
    
    // Sinon, on passe à l'étape suivante avec animation
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  /**
   * Fonction pour revenir à l'étape précédente
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  // ========== COMPLÉTION DU QUESTIONNAIRE ==========

  /**
   * Fonction appelée quand l'utilisateur termine le questionnaire
   */
  const handleComplete = async () => {
    try {
      // Préparation des données de session
      const sessionData = {
        sessionId: Date.now().toString(), // ID unique basé sur le timestamp
        responses, // Toutes les réponses utilisateur
        progress: { 
          currentStep: currentStep + 1, 
          totalSteps: questionnaireSteps.length, 
          completedSteps: [] 
        },
      };
      
      // Envoi des réponses à l'API pour sauvegarde en base
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      
      // Vérification de la réponse serveur
      if (!res.ok) throw new Error("Erreur lors de l'envoi des réponses");
      
      
      // Sauvegarde dans l'historique local
      saveToHistory({
          ...sessionData, 
          completedAt: new Date(),
          id: sessionData.sessionId, // Utilisation de l'ID de session
          date: new Date()
      });
      
      // Nettoyage du localStorage
      clearResponses();
      
      // Notification de succès
      toast.success("Questionnaire complété !");
      
      // Redirection vers la page des résultats
      router.push(`/resultats/${sessionData.sessionId}`);
      
    } catch (err) {
      // Gestion des erreurs avec notification
      console.error(err);
      toast.error("Impossible de sauvegarder vos réponses");
    }
  };

  // ========== GESTION DES RÉPONSES UTILISATEUR ==========

  /**
   * Met à jour une réponse spécifique
   * @param questionId - ID de la question
   * @param value - Valeur de la réponse (string ou string[])
   */
  const updateResponse = (questionId: string, value: string | string[]): void => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // ========== CONFIGURATION DES ANIMATIONS ==========

  /**
   * Variants pour les animations de transition entre étapes
   */
  const slideVariants = {
    enter: (d: number): { x: number; opacity: number } => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }), // Entrée
    center: { zIndex: 1, x: 0, opacity: 1 }, // Position centrale
    exit: (d: number): { zIndex: number; x: number; opacity: number } => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0 }), // Sortie
  };

  // ========== RENDU DU COMPOSANT ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        
        {/* Barre de progression visuelle */}
        <ProgressBar current={currentStep + 1} total={questionnaireSteps.length} />

        {/* Système d'animation pour les transitions entre étapes */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep} // Clé unique pour forcer le re-rendu à chaque changement
            custom={direction} // Direction passée aux variants
            variants={slideVariants} // Applique les animations
            initial="enter" // État initial
            animate="center" // État d'animation
            exit="exit" // État de sortie
            transition={{ 
              x: { type: "spring", stiffness: 300, damping: 30 }, // Animation élastique
              opacity: { duration: 0.2 } // Fondu rapide
            }}
          >
            {/* Carte contenant l'étape actuelle */}
            <Card className="p-8 shadow-xl">
              
              {/* Titre et description de l'étape */}
              <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
              {step.description && (
                <p className="text-muted-foreground mb-6">{step.description}</p>
              )}

              {/* Liste des questions de l'étape */}
              <div className="space-y-8">
                {visibleQuestions.map(q => (
                  <div key={q.id} className="space-y-3">
                    
                    {/* Label de la question */}
                    <label className="text-lg font-semibold block">
                      {q.text} 
                      {q.required && ( // Astérisque pour les questions obligatoires
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </label>

                    {/* Rendu conditionnel selon le type de question */}

                    {/* Question à choix unique (boutons radio) */}
                    {q.type === "radio" && q.options && (
                      <RadioGroupCard 
                        options={q.options} 
                        value={(responses[q.id] as string) || ""} 
                        onChange={v => updateResponse(q.id, v)} 
                      />
                    )}

                    {/* Question à choix multiples (cases à cocher) */}
                    {q.type === "checkbox" && q.options && (
                      <CheckboxGroupCard 
                        options={q.options} 
                        values={(responses[q.id] as string[]) || []} 
                        onChange={v => updateResponse(q.id, v)} 
                      />
                    )}

                    {/* Champ de texte simple */}
                    {q.type === "text" && (
                      <Input 
                        value={(responses[q.id] as string) || ""} 
                        onChange={e => updateResponse(q.id, e.target.value)} 
                        placeholder={q.placeholder || ""} 
                      />
                    )}

                    {/* Zone de texte multiligne */}
                    {q.type === "textarea" && (
                      <Textarea 
                        value={(responses[q.id] as string) || ""} 
                        onChange={e => updateResponse(q.id, e.target.value)} 
                        placeholder={q.placeholder || ""} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Boutons de navigation */}
        <div className="flex justify-between mt-8">
          
          {/* Bouton Précédent - désactivé sur la première étape */}
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Précédent
          </Button>

          {/* Bouton Suivant/Terminer - désactivé si validation échoue */}
          <Button 
            size="lg" 
            onClick={handleNext} 
            disabled={!canProceed} 
            className="bg-primary hover:bg-primary/90"
          >
            {isLastStep ? (
              // Affichage pour la dernière étape
              <>
                <Check className="w-5 h-5 mr-2" />
                Terminer
              </>
            ) : (
              // Affichage pour les étapes normales
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