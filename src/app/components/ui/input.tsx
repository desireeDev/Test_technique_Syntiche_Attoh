"use client";

import * as React from "react";
import { cn } from "@/app/lib/utils"; // Utilitaire pour concaténer des classes conditionnellement

/**
 * Input
 * Composant input stylisé réutilisable pour les formulaires.
 * 
 * - Utilise React.forwardRef pour permettre aux parents de récupérer la référence DOM.
 * - Hérite de toutes les props d'un <input> HTML standard.
 * - Supporte le style dynamique via TailwindCSS et l'ajout de classes supplémentaires via `className`.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type} // Type d'input (text, password, email, etc.)
        ref={ref}   // Référence pour le DOM
        className={cn(
          // Classes par défaut TailwindCSS pour le style et l'interaction
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground", // Style pour les inputs type "file"
          "placeholder:text-muted-foreground", // Couleur des placeholders
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Focus accessible
          "disabled:cursor-not-allowed disabled:opacity-50", // Styles quand désactivé
          "md:text-sm", // Texte plus petit sur écrans moyens
          className // Permet d'ajouter des classes supplémentaires via props
        )}
        {...props} // Spread des autres props (value, onChange, placeholder, etc.)
      />
    );
  }
);

Input.displayName = "Input"; // Nom affiché dans React DevTools

export { Input };
