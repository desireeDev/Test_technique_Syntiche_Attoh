import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"; // Composant checkbox accessible de Radix UI
import { Check } from "lucide-react"; // Icône check de Lucide

import { cn } from "@/app/lib/utils"; // Fonction utilitaire pour concaténer des classes conditionnellement

/**
 * Checkbox
 * Composant checkbox stylisé utilisant Radix UI et TailwindCSS.
 * - La logique d'état (checked, disabled, focus) est gérée par Radix.
 * - L'apparence (bordure, couleurs, icône) est gérée via TailwindCSS et classes dynamiques.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>, // Type de la référence pour TS
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> // Props héritées du composant Radix
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background", // Taille, bordure et coins arrondis
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", // Style quand cochée
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Focus pour accessibilité
      "disabled:cursor-not-allowed disabled:opacity-50", // Styles quand désactivée
      className // Classes supplémentaires passées depuis les props
    )}
    {...props} // Spread des props comme checked, onCheckedChange, disabled, etc.
  >
    {/* Icône affichée quand la checkbox est cochée */}
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName; // Nom pour React DevTools

export { Checkbox };
