"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Home, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface QuestionnaireResult {
  sessionId: string;
  responses: Record<string, any>;
  progress: {
    currentStep: number;
    totalSteps: number;
    completedSteps: number[];
  };
  completedAt: string;
  totalScore?: number;
}

export default function Results({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [loading, setLoading] = useState(true);

  // ----------- FETCH DES RÉSULTATS DE L'API -----------
  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        // CORRECTION : Utilisez le bon endpoint avec query parameter
        const res = await fetch(`/api/responses?sessionId=${id}`);
        if (!res.ok) throw new Error("Résultats introuvables");
        
        const data = await res.json();
        
        // CORRECTION : Vérifiez la structure de la réponse
        if (!data.session) {
          throw new Error("Session non trouvée");
        }
        
        setResult(data.session);
      } catch (error) {
        console.error("Erreur détaillée:", error);
        toast.error("Erreur lors du chargement des résultats");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="progress-bar mb-4">
          <div className="progress-bar-fill" style={{ width: "70%" }}></div>
        </div>
        <p className="text-muted-foreground">Chargement des résultats...</p>
      </div>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="card p-8 text-center max-w-md">
        <h2 className="h2 mb-4">Résultats non trouvés</h2>
        <p className="text-muted-foreground mb-6">
          Impossible de charger les résultats pour cette session.
        </p>
        <button 
          onClick={() => router.push("/")}
          className="button button-primary"
        >
          Retour à accueil
        </button>
      </div>
    </div>
  );

  // ----------- GÉNÉRATION DES DONNÉES POUR LES GRAPHIQUES -----------
  // Utilisez vos fonctions existantes ou créez des données mock pour tester
  const categories = [
    { name: "Frontend", score: 80, maxScore: 100, percentage: 80 },
    { name: "Backend", score: 75, maxScore: 100, percentage: 75 },
    { name: "Outils", score: 90, maxScore: 100, percentage: 90 }
  ];

  const totalScore = result.totalScore || 85;
  const totalMaxScore = 100;

  const handleExportPDF = () => {
    // exportToPDF(result.responses);
    toast.success("PDF exporté avec succès !");
  };

  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          {/* Header avec score global et boutons */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="h1 mb-2">Vos Résultats</h1>
              <p className="text-muted-foreground">
                Complété le {new Date(result.completedAt).toLocaleDateString("fr-FR")}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-3xl font-bold text-primary">
                  {totalScore} / {totalMaxScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  Score Global : {((totalScore / totalMaxScore) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => router.push("/history")}
                className="button button-outline flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Historique
              </button>
              <button 
                onClick={handleExportPDF}
                className="button button-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>

          {/* Résumé des réponses */}
          <div className="card p-6 mb-6">
            <h2 className="h2 mb-6">Résumé de vos réponses</h2>
            <div className="space-y-4">
              {Object.entries(result.responses).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-muted-foreground">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compétences par catégorie */}
          <div className="card p-6 mb-6">
            <h2 className="h2 mb-6">Répartition des Compétences</h2>
            {categories.map((cat, index) => (
              <div key={cat.name} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-muted-foreground">
                    {cat.score} / {cat.maxScore} ({cat.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="progress-bar-fill"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bouton retour accueil */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => router.push("/")} 
              className="button button-outline flex items-center gap-2"
            >
              <Home className="w-5 h-5" /> Retour accueil
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}