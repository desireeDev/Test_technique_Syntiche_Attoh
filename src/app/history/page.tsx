"use client";

import { motion } from "framer-motion"; 
import { useRouter } from "next/navigation"; 
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { getHistory } from "@/app/utils/storage";
import { Eye, Calendar, ArrowLeft, User, Star } from "lucide-react";
import { useEffect, useState } from "react";

// Interface pour typer les éléments d'historique
interface HistoryItem {
  id: string;
  sessionId?: string;
  completedAt: string;
  responses: Record<string, any>;
  totalScore?: number;
  progress?: {
    currentStep: number;
    totalSteps: number;
  };
}

const History = () => {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Charger l'historique côté client seulement
  useEffect(() => {
    const loadHistory = () => {
      try {
        const historyData = getHistory();
        // Convert Date to string for HistoryItem interface
        const convertedHistory = historyData.map(item => ({
          ...item,
          completedAt: item.completedAt instanceof Date ? item.completedAt.toISOString() : item.completedAt
        }));
        setHistory(convertedHistory);
      } catch (error) {
        console.error("Erreur chargement historique:", error);
      }
    };

    loadHistory();
  }, []);

  // Fonction pour extraire les informations des réponses
  const getSessionInfo = (item: HistoryItem) => {
    const responses = item.responses || {};
    
    // Utiliser les bonnes clés de questionnaire (q1, q2, q3)
    const name = responses.q1?.answer || "Anonyme";
    const experience = responses.q2?.answer || "Non spécifié";
    const specialization = responses.q3?.answer || "Non spécifié";
    const totalScore = item.totalScore || 0;

    return { name, experience, specialization, totalScore };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header avec titre et bouton retour */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Historique des questionnaires</h1>
              <p className="text-muted-foreground">
                Consultez et comparez vos évaluations passées
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </div>

          {history.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun historique pour le moment</h3>
                <p className="text-muted-foreground mb-6">
                  Complétez votre premier questionnaire pour voir vos résultats ici
                </p>
                <Button onClick={() => router.push("/questionnaire")}>
                  Commencer le questionnaire
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => {
                const sessionInfo = getSessionInfo(item);
                
                return (
                  <motion.div
                    key={item.id} // ✅ MAINTENANT GARANTI UNIQUE par le storage
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                Évaluation #{history.length - index}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.completedAt ? 
                                  new Date(item.completedAt).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  }) : 
                                  "Date non disponible"
                                }
                              </p>
                            </div>
                          </div>

                          {/* Informations de la session */}
                          <div className="ml-13 mt-3 space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {sessionInfo.name}
                              </span>
                              
                              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
                                {sessionInfo.experience}
                              </span>
                              
                              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                                {sessionInfo.specialization}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                Score: {sessionInfo.totalScore} pts
                              </span>
                              <span>
                                {Object.keys(item.responses || {}).length} questions répondues
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => router.push(`/resultats/${item.sessionId || item.id}`)}
                          className="ml-4"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir les résultats
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {history.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button size="lg" onClick={() => router.push("/questionnaire")}>
                Faire une nouvelle évaluation
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;