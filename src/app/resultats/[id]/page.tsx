// app/resultats/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Download, Home, ArrowLeft, Calendar, User, Star } from "lucide-react";
import { generateChartData, CategoryScore, RadarData, ChartData } from "@/app/utils/chartData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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
  isCompleted?: boolean;
}

// Couleurs pour les graphiques - palette prédéfinie pour une cohérence visuelle
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  // ÉTATS DE GESTION DES DONNÉES
  const [session, setSession] = useState<Session | null>(null);      // Session récupérée
  const [loading, setLoading] = useState(true);                      // État de chargement
  const [error, setError] = useState<string | null>(null);           // Gestion des erreurs
  const [chartData, setChartData] = useState<any>(null);             // Données pour les graphiques

  // ====================================================================
  // EFFET : RÉCUPÉRATION DE LA SESSION ET GÉNÉRATION DES GRAPHIQUES
  // ====================================================================
  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log("🔍 Recherche session:", sessionId);
        
        // STRATÉGIE DE RÉCUPÉRATION EN 2 ÉTAPES :
        
        // 1. ESSAI LOCALSTORAGE (RAPIDE) - données persistées côté client
        const saved = localStorage.getItem('questionnaire-history');
        const history = saved ? JSON.parse(saved) : [];
        
        // Recherche par sessionId OU id (pour compatibilité)
        const localSession = history.find((item: any) => 
          item.sessionId === sessionId || item.id === sessionId
        );
        
        if (localSession) {
          console.log("✅ Session trouvée dans localStorage");
          setSession(localSession);
          
          // 🎯 GÉNÉRATION DES DONNÉES POUR GRAPHIQUES
          // Transforme les réponses brutes en données structurées pour Recharts
          const generatedChartData = generateChartData(localSession.responses);
          setChartData(generatedChartData);
          setLoading(false);
          return;
        }

        // 2. FALLBACK API (SI PAS EN LOCAL) - données serveur MongoDB
        console.log("🌐 Recherche via API...");
        const res = await fetch(`/api/responses?sessionId=${sessionId}`);
        
        if (!res.ok) {
          throw new Error(`Erreur API: ${res.status}`);
        }

        const data = await res.json();
        console.log("📦 Réponse API:", data);
        
        // GESTION DES DIFFÉRENTS FORMATS DE RÉPONSE
        if (data.session) {
          // Format standard : data.session (objet unique)
          console.log("✅ Session trouvée via API");
          setSession(data.session);
          const generatedChartData = generateChartData(data.session.responses);
          setChartData(generatedChartData);
        } else if (data.sessions) {
          // Ancien format : data.sessions (rétrocompatibilité)
          console.log("✅ Session trouvée (ancienne structure)");
          setSession(data.sessions);
          const generatedChartData = generateChartData(data.sessions.responses);
          setChartData(generatedChartData);
        } else {
          // Aucune donnée trouvée
          console.warn("❌ Aucune session dans la réponse API");
          setError("Session non trouvée dans la base de données");
        }
      } catch (err) {
        console.error("💥 Erreur chargement session:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    } else {
      setError("ID de session manquant");
      setLoading(false);
    }
  }, [sessionId]);

  // ====================================================================
  // COMPOSANTS D'ÉTAT : LOADING ET ERREUR
  // ====================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          {/* Animation de chargement CSS pure */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des résultats...</p>
          <p className="text-sm text-muted-foreground mt-2">Session: {sessionId}</p>
        </div>
      </div>
    );
  }

  if (error || !session || !chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Session non trouvée</h2>
          <p className="text-muted-foreground mb-4">
            {error || "Impossible de charger les résultats"}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            ID: {sessionId}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/history")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Historique
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ====================================================================
  // CALCULS ET EXTRACTIONS DE DONNÉES
  // ====================================================================
  
  // 📊 CALCUL DU SCORE TOTAL
  // Si totalScore n'existe pas, on le calcule en sommant tous les scores individuels
  const totalScore = session.totalScore || Object.values(session.responses).reduce((total: number, r: any) => total + (r.score || 0), 0);
  const totalQuestions = Object.keys(session.responses).length;

  // 👤 EXTRACTION DES INFORMATIONS PRINCIPALES
  const getName = () => session.responses.q1?.answer || "Anonyme";
  
  const getExperience = () => {
    const exp = session.responses.q2?.answer;
    // Mapping des valeurs techniques vers des libellés utilisateur
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
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ==================================================================== */}
          {/* EN-TÊTE AVEC INFORMATIONS PRINCIPALES */}
          {/* ==================================================================== */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Résultats du Questionnaire</h1>
              <p className="text-muted-foreground mb-4">
                Session complétée le {new Date(session.completedAt).toLocaleDateString("fr-FR", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              
              {/* Badges d'informations utilisateur */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                  <User className="w-4 h-4" />
                  <span>{getName()}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500">
                  <Star className="w-4 h-4" />
                  <span>{getExperience()}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500">
                  <Calendar className="w-4 h-4" />
                  <span>{getSpecialization()}</span>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
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

          {/* ==================================================================== */}
          {/* SCORE GLOBAL */}
          {/* ==================================================================== */}
          <Card className="p-6 mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Score Global</h2>
              <div className="text-5xl font-bold text-primary mb-2">
                {totalScore} pts
              </div>
              <p className="text-muted-foreground">
                {totalQuestions} questions répondues • Score maximum: {chartData.totalMaxScore} pts
              </p>
            </div>
          </Card>

          {/* ==================================================================== */}
          {/* SECTION GRAPHIQUES - PARTIE COMPLEXE */}
          {/* ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* 📈 GRAPHIQUE RADAR - PROFIL DE COMPÉTENCES */}
            {/* Idéal pour montrer les forces/faiblesses sur plusieurs axes */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Profil de Compétences</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData.radarData}>
                    <PolarGrid /> {/* Grille polaire (cercles concentriques) */}
                    <PolarAngleAxis dataKey="category" /> {/* Catégories sur l'angle */}
                    <PolarRadiusAxis angle={30} domain={[0, 40]} /> {/* Échelle radiale */}
                    <Radar
                      name="Compétences"
                      dataKey="score" // Donnée à afficher
                      stroke="#8884d8" // Couleur de la ligne
                      fill="#8884d8" // Couleur de remplissage
                      fillOpacity={0.6} // Transparence
                    />
                    <Tooltip /> {/* Infobulle au survol */}
                    <Legend /> {/* Légende des données */}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 📊 GRAPHIQUE EN BARRES - SCORES PAR CATÉGORIE */}
            {/* Comparaison visuelle entre score obtenu et score max */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Scores par Catégorie</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.categories}>
                    <CartesianGrid strokeDasharray="3 3" /> {/* Grille en pointillés */}
                    <XAxis dataKey="name" /> {/* Noms des catégories */}
                    <YAxis /> {/* Échelle des scores */}
                    <Tooltip 
                      formatter={(value) => [`${value} pts`, 'Score']} // Formatage infobulle
                      labelFormatter={(label) => `Catégorie: ${label}`}
                    />
                    <Legend />
                    {/* Barre du score obtenu */}
                    <Bar dataKey="score" name="Score obtenu" fill="#8884d8" />
                    {/* Barre du score maximum (référence) */}
                    <Bar dataKey="maxScore" name="Score maximum" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 🥧 GRAPHIQUE CAMEMBERT - SPÉCIALISATION */}
            {/* Montre la répartition en pourcentages */}
            {chartData.roleData.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Spécialisation</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.roleData}
                        cx="50%" // Centre X
                        cy="50%" // Centre Y
                        labelLine={false} // Pas de ligne vers les labels
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Label formaté
                        outerRadius={80} // Taille du camembert
                        fill="#8884d8"
                        dataKey="value" // Donnée pour calculer les parts
                      >
                        {/* Attribution des couleurs à chaque segment */}
                        {chartData.roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Affinité']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* 📊 GRAPHIQUE BARRES VERTICALES - PRÉFÉRENCES DE PROJET */}
            {/* Layout vertical pour meilleure lisibilité des labels longs */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Préférences de Projet</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData.projectPreferences} 
                    layout="vertical" // ⚡ Layout vertical pour plus d'espace
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} /> 
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={80} // Largeur fixe pour les labels
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Affinité']} />
                    <Legend />
                    <Bar dataKey="value" name="Affinité">
                      {/* Couleurs personnalisées depuis les données */}
                      {chartData.projectPreferences.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* ==================================================================== */}
          {/* RÉPONSES DÉTAILLÉES - VUE TEXTE */}
          {/* ==================================================================== */}
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

          {/* ==================================================================== */}
          {/* BOUTON RETOUR */}
          {/* ==================================================================== */}
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => router.push("/")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Retour à  notre accueil
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}