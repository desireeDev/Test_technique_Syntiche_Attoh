// React et ses hooks
import { useState } from "react"; 
// Hook pour naviguer vers d'autres pages (react-router-dom)
import { useNavigate } from "react-router-dom"; 
// Pour faire des animations douces et faciles avec React
import { motion } from "framer-motion"; 

// Composants UI réutilisables
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

// Icônes de Lucide React
import { Code2 } from "lucide-react";

// Pour afficher des notifications/toasts
import { toast } from "sonner";

const Auth = () => {
  // Pour naviguer vers une autre page
  const navigate = useNavigate();

  // États pour stocker les valeurs saisies dans les formulaires
  const [loginEmail, setLoginEmail] = useState(""); // Email pour login
  const [loginPassword, setLoginPassword] = useState(""); // Mot de passe pour login
  const [signupEmail, setSignupEmail] = useState(""); // Email pour inscription
  const [signupPassword, setSignupPassword] = useState(""); // Mot de passe pour inscription
  const [signupName, setSignupName] = useState(""); // Nom complet pour inscription

  // Fonction exécutée quand l'utilisateur clique sur "Login"
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Vérifie que tous les champs sont remplis
    if (!loginEmail || !loginPassword) {
      toast.error("Veuillez remplir tous les champs"); // Message d'erreur
      return;
    }

    // Ici c'est un simple mock, pas de vraie authentification
    toast.success("Connexion réussie !"); // Message succès
    navigate("/"); // Redirige vers la page d'accueil
  };

  // Fonction exécutée quand l'utilisateur clique sur "Sign Up"
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifie que tous les champs sont remplis
    if (!signupEmail || !signupPassword || !signupName) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // Vérifie que le mot de passe a au moins 6 caractères
    if (signupPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Mock inscription
    toast.success("Compte créé avec succès !");
    navigate("/"); // Redirige vers la page d'accueil
  };

  return (
    // Conteneur principal avec fond en dégradé et centrage vertical/horizontal
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      
      {/* Boîte animée avec Framer Motion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} // état initial (transparent et un peu petit)
        animate={{ opacity: 1, scale: 1 }} // état final (opaque et taille normale)
        transition={{ duration: 0.5 }} // durée de l'animation
        className="w-full max-w-md" // largeur maximale pour ne pas dépasser l'écran
      >

        {/* Logo et titre de la page */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Code2 className="w-8 h-8 text-primary" /> {/* Icône */}
          </div>
          <h1 className="text-3xl font-bold mb-2">Bienvenue</h1>
          <p className="text-muted-foreground">
            Connectez-vous pour accéder à votre profil développeur
          </p>
        </div>

        {/* Carte contenant les onglets Login / Sign Up */}
        <Card className="p-6">
          <Tabs defaultValue="login" className="w-full">
            
            {/* Les onglets en haut */}
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            {/* Contenu de l'onglet Login */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Bouton Connexion */}
                <Button type="submit" className="w-full" size="lg">
                   GO !
                </Button>
              </form>
            </TabsContent>

            {/* Contenu de l'onglet Sign Up */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                
                {/* Nom complet */}
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Créez un mot de passe (min. 6 caractères)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6} // Minimum 6 caractères
                  />
                </div>

                {/* Bouton Inscription */}
                <Button type="submit" className="w-full" size="lg">
                  Créer un compte
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Bouton pour continuer sans compte */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Continuer sans compte
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
