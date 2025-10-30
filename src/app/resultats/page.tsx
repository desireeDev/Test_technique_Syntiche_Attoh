"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Next.js
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { getHistoryItem } from "@/app/utils/storage";
import { generateChartData } from "@/app/utils/chartData";
import { exportToPDF } from "@/app/utils/pdfExport";
import { QuestionnaireResult } from "@/app/types/questionnaire";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, PieLabelRenderProps 
} from "recharts";
import { Download, Home, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Results = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [result, setResult] = useState<QuestionnaireResult | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        const data = await Promise.resolve(getHistoryItem(id));
        if (data) setResult(data);
        else {
          toast.error("Résultats introuvables");
          router.push("/");
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des résultats");
        router.push("/");
      }
    };

    fetchResult();
  }, [id, router]);

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-center">Chargement des résultats...</p>
    </div>
  );

  const { 
    roleData, experienceData, technologiesData, categories, 
    totalScore, totalMaxScore, radarData, projectPreferences 
  } = generateChartData(result.responses);

  const handleExportPDF = () => {
    exportToPDF(result.responses);
    toast.success("PDF exporté avec succès !");
  };

  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Vos Résultats</h1>
              <p className="text-muted-foreground">
                Complété le {new Date(result.completedAt).toLocaleDateString("fr-FR")}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-3xl font-bold text-primary">
                  {totalScore.toFixed(0)} / {totalMaxScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  Score Global : {((totalScore / totalMaxScore) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/history")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Historique
              </Button>
              <Button onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </div>
          </div>

          {/* 🔹 Graphiques et sections inchangés */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Répartition des Compétences par Catégorie</h2>
            {categories.map((cat, index) => (
              <div key={cat.name} className="mb-4">
                <div className="flex justify-between">
                  <span>{cat.name}</span>
                  <span>{cat.score} / {cat.maxScore} ({cat.percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{ background: `linear-gradient(to right, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})` }}
                    className="h-3 rounded-full"
                  />
                </div>
              </div>
            ))}
          </Card>

          {/* Radar, Bar, Pie Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Technologies Maîtrisées</h2>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#444" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "currentColor", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, "dataMax"]} />
                  <Radar name="Vos compétences" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Préférences de Projet</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={projectPreferences}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {projectPreferences.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* … les autres sections (Pie, Bar, détails) restent identiques … */}

          <div className="flex justify-center mt-8">
            <Button size="lg" onClick={() => router.push("/")} variant="outline">
              <Home className="w-5 h-5 mr-2" /> Retour accueil
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
