// Pour les animations avec React
import { motion } from "framer-motion"; 
// Pour naviguer entre les pages
import { useNavigate } from "react-router-dom"; 
// Composants UI réutilisables
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
// Fonction utilitaire pour récupérer l'historique stocké
import { getHistory } from "@/app/utils/storage";
// Icônes de Lucide React
import { Home, Eye, Calendar, ArrowLeft } from "lucide-react";

const History = () => {
  // Hook pour naviguer entre les pages
  const navigate = useNavigate();
  // Récupère l'historique des questionnaires depuis le stockage
  const history = getHistory();

  return (
    // Conteneur principal avec fond en dégradé et padding
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Animation d'apparition de la section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // état initial (transparent et décalé vers le bas)
          animate={{ opacity: 1, y: 0 }} // état final (opaque et à sa position normale)
          transition={{ duration: 0.5 }} // durée de l'animation
        >
          {/* Header avec titre et bouton retour */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Historique des questionnaires</h1>
              <p className="text-muted-foreground">
                Consultez et comparez vos évaluations passées
              </p>
            </div>
            
            {/* Bouton pour revenir à l'accueil */}
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </div>

          {/* Si l'historique est vide */}
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
                <Button onClick={() => navigate("/questionnaire")}>
                  Commencer le questionnaire
                </Button>
              </div>
            </Card>
          ) : (
            // Sinon, afficher l'historique des questionnaires
            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }} // effet d'apparition en cascade
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        {/* Informations principales du questionnaire */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              Évaluation #{history.length - index}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.completedAt).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Tags avec rôle, expérience et style de travail */}
                        <div className="ml-13 mt-3 flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {item.responses.role}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                            {item.responses.experience} ans
                          </span>
                          {item.responses.work_style && (
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium">
                              {item.responses.work_style}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bouton pour voir les résultats détaillés */}
                      <Button
                        onClick={() => navigate(`/results/${item.id}`)}
                        className="ml-4"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir les résultats
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bouton pour commencer un nouveau questionnaire */}
          {history.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button size="lg" onClick={() => navigate("/questionnaire")}>
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
