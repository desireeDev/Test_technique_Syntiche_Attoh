// app/resultats/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Download, Home, ArrowLeft, Calendar, User, Star } from "lucide-react";
import { generateChartData } from "@/app/utils/chartData";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// ====================================================================
// INTERFACE DE LA SESSION
// ====================================================================
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

// ====================================================================
// COULEURS POUR LES GRAPHIQUES
// ====================================================================
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

// ====================================================================
// COMPOSANT PRINCIPAL - PAGE DE RÉSULTATS
// ====================================================================
export default function ResultPage() {
  // ====================================================================
  // HOOKS ET ÉTATS
  // ====================================================================
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  // ====================================================================
  // EFFET : RÉCUPÉRATION DE LA SESSION ET GÉNÉRATION DES GRAPHIQUES
  // ====================================================================
  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log("🔍 === DÉBUT RECHERCHE SESSION ===");
        console.log("📌 Session ID recherché:", sessionId);
        
        // ====================================================================
        // 1. ESSAI LOCALSTORAGE (RAPIDE) - données persistées côté client
        // ====================================================================
        console.log("💾 1. Recherche dans localStorage...");
        const saved = localStorage.getItem('questionnaire-history');
        console.log("📁 localStorage 'questionnaire-history' trouvé:", !!saved);
        
        const history = saved ? JSON.parse(saved) : [];
        console.log("📚 Historique chargé:", history.length, "sessions disponibles");
        
        // Recherche par sessionId OU id (pour compatibilité)
        const localSession = history.find((item: any) => 
          item.sessionId === sessionId || item.id === sessionId
        );
        
        if (localSession) {
          console.log("✅ 1. SESSION TROUVÉE DANS LOCALSTORAGE");
          console.log("📊 Réponses de la session:", localSession.responses);
          
          // Vérification détaillée des réponses critiques
          console.log("🧪 VÉRIFICATION DES RÉPONSES CRITIQUES:");
          console.log("   - q2 (expérience):", localSession.responses.q2?.answer);
          console.log("   - q3 (spécialisation):", localSession.responses.q3?.answer);
          console.log("   - q4 (frontend):", localSession.responses.q4?.answer);
          console.log("   - q7 (backend):", localSession.responses.q7?.answer);
          
          setSession(localSession);
          
          // ====================================================================
          // GÉNÉRATION DES DONNÉES POUR GRAPHIQUES
          // ====================================================================
          console.log("📊 2. GÉNÉRATION DES DONNÉES GRAPHIQUES...");
          const generatedChartData = generateChartData(localSession.responses);
          
          console.log("🎯 3. DONNÉES GRAPHIQUES GÉNÉRÉES:");
          console.log("   - Radar data:", generatedChartData.radarData);
          console.log("   - Pie data:", generatedChartData.pieData);
          console.log("   - Total score:", generatedChartData.totalScore);
          
          setChartData(generatedChartData);
          setLoading(false);
          console.log("✅ === CHARGEMENT TERMINÉ (localStorage) ===");
          return;
        }

        console.log("❌ 1. Session NON trouvée dans localStorage");
        
        // ====================================================================
        // 2. FALLBACK API (SI PAS EN LOCAL) - données serveur MongoDB
        // ====================================================================
        console.log("🌐 2. Recherche via API...");
        const apiUrl = `/api/responses?sessionId=${sessionId}`;
        console.log("   URL API:", apiUrl);
        
        const res = await fetch(apiUrl);
        console.log("   Statut API:", res.status, res.statusText);
        
        if (!res.ok) {
          throw new Error(`Erreur API: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        console.log("📦 3. RÉPONSE API REÇUE:", data);
        
        if (data.session) {
          console.log("✅ 4. SESSION TROUVÉE VIA API");
          console.log("📊 Réponses API:", data.session.responses);
          
          setSession(data.session);
          
          const generatedChartData = generateChartData(data.session.responses);
          console.log("📊 Données graphiques générées (API):", generatedChartData);
          setChartData(generatedChartData);
        } else {
          console.warn("❌ 4. Aucune session dans la réponse API");
          setError("Session non trouvée dans la base de données");
        }
      } catch (err) {
        console.error("💥 === ERREUR CRITIQUE ===");
        console.error("   Message:", err instanceof Error ? err.message : err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        console.log("🏁 === CHARGEMENT TERMINÉ ===");
        setLoading(false);
      }
    };

    if (sessionId) {
      console.log("🚀 LANCEMENT DU CHARGEMENT...");
      fetchSession();
    } else {
      console.error("❌ ID de session manquant");
      setError("ID de session manquant");
      setLoading(false);
    }
  }, [sessionId]);

  // ====================================================================
  // ÉTATS DE CHARGEMENT ET D'ERREUR
  // ====================================================================
  if (loading) {
    console.log("⏳ Rendu: État LOADING");
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des résultats...</p>
          <p className="text-sm text-muted-foreground mt-2">Session: {sessionId}</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    console.log("❌ Rendu: État ERREUR", { error, session: !!session });
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

  // Si chartData n'est pas encore chargé mais session oui
  if (!chartData) {
    console.log("⚠️ Rendu: Session OK mais chartData MANQUANT");
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Génération des graphiques...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Session chargée mais données graphiques manquantes
          </p>
        </div>
      </div>
    );
  }

  console.log(" Rendu: TOUT EST PRÊT", { 
    session: !!session, 
    chartData: !!chartData,
    radarData: chartData.radarData?.length,
    pieData: chartData.pieData?.length
  });

  // ====================================================================
  // CALCULS ET EXTRACTIONS DE DONNÉES
  // ====================================================================
  
  /**
   * Calcule le score total à partir des réponses
   */
//  UTILISE directement le score du serveur :
const totalScore = session.totalScore || 0;
const totalQuestions = Object.keys(session.responses).length;

  /**
   * Extrait le nom de l'utilisateur depuis les réponses
   */
  const getName = () => session.responses.q1?.answer || "Anonyme";
  
  /**
   * Transforme l'expérience technique en libellé lisible
   */
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
  
  /**
   * Transforme la spécialisation technique en libellé lisible
   */
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

  // ====================================================================
  // RENDU PRINCIPAL
  // ====================================================================
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
      {/* UTILISE session.totalScore AU LIEU DE chartData.totalScore */}
      {session.totalScore || 0} pts
     </div>
     <p className="text-muted-foreground">
      {totalQuestions} questions répondues • Score maximum: 100 pts
      {/* SCORE SUR 100 MAINTENANT */}
     </p>
    {/* Badge indicatif de la source du score */}
     <div className="mt-3">
       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
         Score calculé automatiquement
       </span>
     </div>
   </div>
   </Card>
          {/* ==================================================================== */}
          {/* SECTION GRAPHIQUES - CORRIGÉE POUR ÉVITER LES ERREURS DE DIMENSIONS */}
          {/* ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* 📊 GRAPHIQUE RADAR - PROFIL DE COMPÉTENCES */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Profil de Compétences</h3>
              <div className="h-80 min-h-80 w-full"> {/* ⚠️ AJOUT: min-h-80 et w-full pour dimensions stables */}
                {chartData.radarData && chartData.radarData.length > 0 ? (
                  <ResponsiveContainer 
                    width="100%" 
                    height="100%" 
                    minWidth={400}  
                    minHeight={320} 
                  >
                    <RadarChart data={chartData.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 60]} />
                      <Radar
                        name="Compétences"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    ❌ Données radar non disponibles
                  </div>
                )}
              </div>
            </Card>

            {/* 🥧 GRAPHIQUE CAMEMBERT - SPÉCIALISATION */}
            {chartData.pieData && chartData.pieData.length > 0 ? (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Spécialisation</h3>
                <div className="h-80 min-h-80 w-full"> {/* ⚠️ AJOUT: min-h-80 et w-full */}
                  <ResponsiveContainer 
                    width="100%" 
                    height="100%" 
                    minWidth={400}  
                    minHeight={320} 
                  >
                    <PieChart>
                      <Pie
                        data={chartData.pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {chartData.pieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Spécialisation</h3>
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  ❌ Données camembert non disponibles
                </div>
              </Card>
            )}

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
              Retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}