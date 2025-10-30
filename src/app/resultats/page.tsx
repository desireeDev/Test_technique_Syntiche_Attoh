import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

// Composant principal affichant les resultats du questionnaire
const Results = () => {
  // Recupere l'ID dans l'URL et la fonction de navigation
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Etat pour stocker le resultat du questionnaire
  const [result, setResult] = useState<QuestionnaireResult | null>(null);

  // Effet pour recuperer les resultats depuis le stockage local au chargement
 useEffect(() => {
  if (!id) return;

  // Fonction asynchrone pour récupérer les résultats
  const fetchResult = async () => {
    try {
      // Si getHistoryItem est synchrone, on le wrap dans Promise.resolve
      const data = await Promise.resolve(getHistoryItem(id));

      if (data) {
        setResult(data); // Mise à jour du state après rendu
      } else {
        toast.error("Resultats introuvables");
        navigate("/"); // Redirection si aucune donnée
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des résultats");
      navigate("/");
    }
  };

  fetchResult();
}, [id, navigate]);


  // Affichage d'un ecran de chargement tant que le resultat n'est pas charge
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-center">Chargement des resultats...</p>
      </div>
    );
  }

  // Generation des donnees pour les graphiques a partir des reponses
  const { 
    roleData, 
    experienceData, 
    technologiesData, 
    categories, 
    totalScore, 
    totalMaxScore, 
    radarData, 
    projectPreferences 
  } = generateChartData(result.responses);

  // Fonction pour exporter les resultats en PDF
  const handleExportPDF = () => {
    exportToPDF(result.responses);
    toast.success("PDF exporte avec succes !");
  };

  // Palette de couleurs pour les graphiques
  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Animation d'apparition
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          {/* Entete avec titre, date et score global */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Vos Resultats</h1>
              <p className="text-muted-foreground">
                Complete le {new Date(result.completedAt).toLocaleDateString("fr-FR")}
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

            {/* Boutons Historique et Export PDF */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/history")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Historique
              </Button>
              <Button onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </div>
          </div>

          {/* Section: Competences par categorie */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Repartition des Competences par Categorie</h2>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.score.toFixed(0)} / {category.maxScore} ({category.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-3 rounded-full"
                      style={{ 
                        background: `linear-gradient(to right, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section: Graphiques Radar et Barre */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Radar Chart: Technologies Maitrisees */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Technologies Maitrisees</h2>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#444" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "currentColor", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, "dataMax"]} />
                  <Radar name="Vos competences" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Bar Chart: Preferences de Projet */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Preferences de Projet</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={projectPreferences}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {projectPreferences.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Section: Specialisation et Experience */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* PieChart: Specialisation */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Votre Specialisation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={(props: PieLabelRenderProps) => {
                      const name = props.name ?? "";
                      const percent = typeof props.percent === "number" ? props.percent : 0;
                      return `${name} : ${(percent * 100).toFixed(0)}%`;
                    }}
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* BarChart: Niveau Experience */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Niveau_Experience</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={experienceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Section: Stack Technologique */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Stack Technologique</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={technologiesData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10B981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Section: Reponses Detaillees */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Reponses Detaillees</h2>
            <div className="space-y-4">
              {Object.entries(result.responses).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium capitalize">{key.replace(/_/g, " ")} :</span>
                  <span className="text-muted-foreground text-right ml-4">
                    {Array.isArray(value) ? value.join(", ") : value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bouton: Retour a l'accueil */}
          <div className="flex justify-center mt-8">
            <Button size="lg" onClick={() => navigate("/")} variant="outline">
              <Home className="w-5 h-5 mr-2" /> Retour à la page accueil
            </Button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Results;
