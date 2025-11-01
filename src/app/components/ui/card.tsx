// components/ui/card.jsx
"use client"; // Indique que ce composant s'exécute côté client (dans le navigateur)

import { cn } from "@/app/(backend)/lib/utils"; // Importe la fonction utilitaire pour gérer les classes CSS



// Composant Card principal - conteneur de base
export const Card = ({ className, ...props }) => (
  <div 
    className={cn("card", className)} // Combine la classe "card" avec les classes personnalisées
    {...props} // Passe toutes les autres propriétés (id, onClick, etc.)
  />
);

// En-tête de la carte
export const CardHeader = ({ className, ...props }) => (
  <div 
    className={cn(
      "flex flex-col space-y-1.5 p-6", // Layout flex en colonne avec espacement et padding
      className
    )} 
    {...props} 
  />
);

// Titre de la carte
export const CardTitle = ({ className, ...props }) => (
  <h3 
    className={cn(
      "h3 font-semibold leading-none tracking-tight", // Style de titre h3 avec police semi-gras
      className
    )} 
    {...props} 
  />
);

// Description/texte secondaire de la carte
export const CardDescription = ({ className, ...props }) => (
  <p 
    className={cn(
      "text-sm text-muted-foreground", // Texte petit avec couleur atténuée
      className
    )} 
    {...props} 
  />
);

// Contenu principal de la carte
export const CardContent = ({ className, ...props }) => (
  <div 
    className={cn("p-6 pt-0", className)} // Padding avec padding-top à 0
    {...props} 
  />
);

// Pied de carte (pour les actions/boutons)
export const CardFooter = ({ className, ...props }) => (
  <div 
    className={cn(
      "flex items-center p-6 pt-0", // Layout flex centré avec padding
      className
    )} 
    {...props} 
  />
);
