"use client";

import { motion } from "framer-motion"; 
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/Ui/button";
import { Card } from "@/components/Ui/card";
import { Eye, Calendar, ArrowLeft, User, Star, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

// Interface pour typer les éléments d'historique
interface HistoryItem {
  id: string;
  sessionId: string;
  completedAt: string;
  responses: Record<string, any>;
  totalScore: number;
  progress?: {
    currentStep: number;
    totalSteps: number;
  };
}
//Définition des useStates pour l'historique, le chargement et les erreurs
const History = () => {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger l'historique depuis l'API
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        console.log(" Chargement historique depuis l'API...");
        //appel de l'api
        const response = await fetch('/api/history');
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📦 Historique reçu:", data);
        
        if (data.success && data.history) {
          // ⚠️ LOG DE DEBUG DES SCORES
          console.log("🔍 ANALYSE DES SCORES DANS L'HISTORIQUE:");
          data.history.forEach((item: HistoryItem, index: number) => {
            console.log(`   Session ${index + 1}:`, {
              sessionId: item.sessionId,
              totalScore: item.totalScore,
              completedAt: item.completedAt,
              questions: Object.keys(item.responses || {}).length
            });
          });
          
          setHistory(data.history);
        } else {
          throw new Error('Format de réponse invalide');
        }
      } catch (err) {
        console.error("❌ Erreur chargement historique:", err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Fonction pour extraire les informations des réponses
  const getSessionInfo = (item: HistoryItem) => {
    const responses = item.responses || {};
    
    const name = responses.q1?.answer || responses.q1?.value || "Anonyme";
    const experience = responses.q2?.answer || responses.q2?.value || "Non spécifié";
    const specialization = responses.q3?.answer || responses.q3?.value || "Non spécifié";
    const totalScore = item.totalScore || 0;

    return { name, experience, specialization, totalScore };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4">
            <RefreshCw className="w-6 h-6 mx-auto" />
          </div>
          <p className="text-muted-foreground">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Erreur de chargement</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

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
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-muted-foreground mt-1">
                  {history.length} evaluations
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </div>
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
                    key={item.sessionId}
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

                              {/* Badge score avec couleur selon la valeur */}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                sessionInfo.totalScore >= 80 ? 'bg-green-500/10 text-green-500' :
                                sessionInfo.totalScore >= 60 ? 'bg-blue-500/10 text-blue-500' :
                                sessionInfo.totalScore >= 40 ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-orange-500/10 text-orange-500'
                              }`}>
                                Score: {sessionInfo.totalScore}/100
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                {Object.keys(item.responses || {}).length} questions répondues
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => router.push(`/resultats/${item.sessionId}`)}
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