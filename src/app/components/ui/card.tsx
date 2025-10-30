"use client";
import * as React from "react";
import { cn } from "@/app/lib/utils"; // Fonction utilitaire pour concaténer les classes conditionnellement

/**
 * Card
 * Composant principal pour créer une carte avec bordure, ombre et arrière-plan.
 * Utilise React.forwardRef pour permettre de passer une référence au div principal.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * CardHeader
 * Partie supérieure de la carte, souvent utilisée pour le titre et la description.
 * Contient un padding interne et espace vertical entre les éléments.
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

/**
 * CardTitle
 * Titre principal de la carte.
 * Par défaut : texte grand, gras et avec un suivi serré.
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

/**
 * CardDescription
 * Texte descriptif sous le titre.
 * Style par défaut : petit texte et couleur atténuée (muted).
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

/**
 * CardContent
 * Contenu principal de la carte.
 * Padding interne, mais pas en haut pour séparer du header.
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

/**
 * CardFooter
 * Pied de la carte pour actions, boutons ou informations complémentaires.
 * Alignement horizontal et padding interne similaire au contenu.
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

// Exportation des composants pour utilisation dans d'autres parties de l'application
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
