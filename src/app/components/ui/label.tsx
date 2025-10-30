import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label"; // Label accessible de Radix UI
import { cva, type VariantProps } from "class-variance-authority"; // Gestion des variantes de style

import { cn } from "@/app/lib/utils"; // Fonction pour concaténer les classes conditionnellement

/**
 * labelVariants
 * Définition des variantes de style du label.
 * - Ici, texte petit, gras et alignement sans espace
 * - Gère aussi l'état disabled du parent via peer-disabled
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

/**
 * Label
 * Composant Label réutilisable pour formulaires.
 * - Basé sur Radix Label pour accessibilité
 * - Permet de gérer les variantes via CVA
 * - Supporte forwardRef pour accéder au DOM depuis le parent
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>, // Type de la ref
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants> // Props standard + variantes
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)} // Applique les variantes et classes supplémentaires
    {...props} // Spread des props comme htmlFor, children, etc.
  />
));

Label.displayName = LabelPrimitive.Root.displayName; // Pour React DevTools

export { Label };
