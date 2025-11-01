"use client";

import { Button } from "@/components/Ui/button";
import { Card } from "@/components/Ui/card";
import { motion } from "framer-motion";
import { Code2, Sparkles, TrendingUp, History, LogIn, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header simplifié */}
      <header className="border-b border-border">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">DevProfile</span>
          </div>

          <Button 
            variant="outline" 
            onClick={() => router.push("/auth")}
            className="button button-outline button-sm"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
        </div>
      </header>

      {/* Section Hero principale */}
      <main className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="h1 mb-6">
            Découvrez votre profil développeur
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Répondez à notre questionnaire complet pour analyser votre stack technologique, 
            votre expérience et vos préférences. Obtenez des insights sur votre parcours de développeur.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => router.push("/questionnaire")}
              className="button button-primary text-base px-8 py-3"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Commencer le questionnaire
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/history")}
              className="button button-outline text-base px-6 py-3"
            >
              <History className="w-5 h-5 mr-2" />
              Voir l'historique
            </Button>
          </div>
        </motion.div>

        {/* Section features avec séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full border-t border-border"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative bg-background px-4"
          >
            <Card className="card text-center p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Évaluation en 5 étapes</h3>
              <p className="text-sm text-muted-foreground">
                Répondez à des questions sur votre rôle, vos technologies et vos préférences professionnelles
              </p>
            </Card>

            <Card className="card text-center p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Résultats visuels</h3>
              <p className="text-sm text-muted-foreground">
                Obtenez de beaux graphiques et insights sur votre profil développeur
              </p>
            </Card>

            <Card className="card text-center p-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 mx-auto">
                <History className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Suivi de progression</h3>
              <p className="text-sm text-muted-foreground">
                Sauvegardez vos résultats et comparez-les dans le temps
              </p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Home;