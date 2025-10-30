import { Button } from "@/app/components/ui/button"; // Composant bouton réutilisable
import { Card } from "@/app/components/ui/card"; // Composant carte réutilisable
import { useNavigate } from "react-router-dom"; // Hook pour la navigation
import { motion } from "framer-motion"; // Pour les animations
import { Code2, Sparkles, TrendingUp, History, LogIn } from "lucide-react"; // Icônes

const Home = () => {
  const navigate = useNavigate(); // Hook pour naviguer vers d'autres pages

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header avec le bouton de connexion */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo et titre */}
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg">DevProfile</span>
          </div>

          {/* Bouton de connexion */}
          <Button variant="outline" onClick={() => navigate("/auth")}>
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </Button>
        </div>
      </div>

      {/* Section principale */}
      <div className="container mx-auto px-4 py-16">
        {/* Animation d’introduction avec Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Badge d’introduction */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 rounded-full">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Évaluation du profil développeur
            </span>
          </div>
          
          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
            Découvrez votre profil développeur
          </h1>
          
          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Répondez à notre questionnaire complet pour analyser votre stack technologique,
            votre expérience et vos préférences. Obtenez des insights sur votre parcours de développeur.
          </p>

          {/* Boutons d’action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Bouton pour démarrer le questionnaire */}
            <Button
              size="lg"
              onClick={() => navigate("/questionnaire")}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Commencer le questionnaire
            </Button>
            
            {/* Bouton pour voir l’historique */}
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/history")}
              className="text-lg px-8 py-6"
            >
              <History className="w-5 h-5 mr-2" />
              Voir l’historique
            </Button>
          </div>
        </motion.div>

        {/* Cartes présentant les fonctionnalités */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {/* Carte 1 : Évaluation en 5 étapes */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Évaluation en 5 étapes</h3>
            <p className="text-sm text-muted-foreground">
              Répondez à des questions sur votre rôle, vos technologies et vos préférences professionnelles
            </p>
          </Card>

          {/* Carte 2 : Résultats visuels */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Résultats visuels</h3>
            <p className="text-sm text-muted-foreground">
              Obtenez de beaux graphiques et insights sur votre profil développeur
            </p>
          </Card>

          {/* Carte 3 : Suivi de progression */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Suivi de progression</h3>
            <p className="text-sm text-muted-foreground">
              Sauvegardez vos résultats et comparez-les dans le temps
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
