// app/resultats/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Download, Home, ArrowLeft, Calendar, User, Star } from "lucide-react";

interface Session {
  sessionId: string;
  responses: Record<string, any>;
  progress: {
    currentStep: number;
    totalSteps: number;
  };
  completedAt: string;
  totalScore?: number;
  createdAt: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Essayer de récupérer depuis l'API
        const res = await fetch(`/api/responses?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.sessions) {
            setSession(data.sessions);
          } else {
            // Essayer depuis l'historique local
            const saved = localStorage.getItem('questionnaire-history');
            const history = saved ? JSON.parse(saved) : [];
            const localSession = history.find((item: any) => 
              item.sessionId === sessionId || item.id === sessionId
            );
            setSession(localSession || null);
          }
        }
      } catch (error) {
        console.error("Erreur chargement session:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (!session) return (
    <div className="text-center py-20">
      <Card className="p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Session non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          Impossible de trouver les résultats pour cette session.
        </p>
        <Button onClick={() => router.push("/history")}>
          Retour à l'historique
        </Button>
      </Card>
    </div>
  );

  // Calculer le score total
  const totalScore = session.totalScore || Object.values(session.responses).reduce((total: number, r: any) => total + (r.score || 0), 0);
  const totalQuestions = Object.keys(session.responses).length;

  // Extraire les informations principales
  const getName = () => session.responses.q1?.answer || "Anonyme";
  const getExperience = () => {
    const exp = session.responses.q2?.answer;
    const experienceMap: Record<string, string> = {
      "junior": "Junior (0-2 ans)",
      "intermediate": "Intermédiaire (2-5 ans)", 
      "senior": "Senior (5-10 ans)",
      "expert": "Expert (10+ ans)"
    };
    return experienceMap[exp] || exp || "Non spécifié";
  };
  const getSpecialization = () => {
    const spec = session.responses.q3?.answer;
    const specMap: Record<string, string> = {
      "frontend": "Frontend",
      "backend": "Backend", 
      "fullstack": "Full-Stack",
      "mobile": "Mobile",
      "devops": "DevOps"
    };
    return specMap[spec] || spec || "Non spécifié";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Résultats du Questionnaire</h1>
              <p className="text-muted-foreground mb-4">
                Session complétée le {new Date(session.completedAt).toLocaleDateString("fr-FR")}
              </p>
              
              {/* Informations principales */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{getName()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{getExperience()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>{getSpecialization()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/history")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Historique
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Score global */}
          <Card className="p-6 mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Score Global</h2>
              <div className="text-5xl font-bold text-primary mb-2">
                {totalScore} pts
              </div>
              <p className="text-muted-foreground">
                {totalQuestions} questions répondues
              </p>
            </div>
          </Card>

          {/* Réponses détaillées */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Réponses Détaillées</h2>
            <div className="space-y-4">
              {Object.entries(session.responses).map(([questionId, response]: [string, any]) => (
                <div key={questionId} className="border-b border-border pb-4 last:border-b-0">
                  <h3 className="font-semibold mb-2">Question {questionId}</h3>
                  <p className="text-muted-foreground mb-1">
                    Réponse: {response.answer || JSON.stringify(response)}
                  </p>
                  {response.score !== undefined && (
                    <p className="text-sm text-green-600">
                      Score: {response.score} points
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Bouton retour */}
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => router.push("/")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}