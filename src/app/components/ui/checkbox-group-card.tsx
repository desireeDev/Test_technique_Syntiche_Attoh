"use client";
import { Checkbox } from "@/app/components/ui/checkbox"; // Composant Checkbox réutilisable
import { Label } from "@/app/components/ui/label"; // Composant Label réutilisable
import { cn } from "@/app/lib/utils"; // Utilitaire pour concaténer des classes conditionnellement

// Définition d'une option individuelle du groupe de checkbox
interface Option {
  id?: string; // ID optionnel, utile pour lier le label à la checkbox
  label: string; // Texte affiché pour l'option
  value: string; // Valeur unique de l'option
}

// Props attendues par le composant CheckboxGroupCard
interface CheckboxGroupCardProps {
  options: Option[]; // Liste des options disponibles
  values: string[]; // Valeurs actuellement sélectionnées
  onChange: (values: string[]) => void; // Callback lorsque la sélection change
  className?: string; // Classes CSS additionnelles pour le conteneur
}

/**
 * CheckboxGroupCard
 * Composant permettant de créer un groupe de cases à cocher stylisées sous forme de "cartes".
 */
export const CheckboxGroupCard = ({
  options,
  values,
  onChange,
  className,
}: CheckboxGroupCardProps) => {
  /**
   * handleCheck
   * Met à jour la liste des valeurs sélectionnées selon que l'option est cochée ou décochée.
   */
  const handleCheck = (optionValue: string, checked: boolean) => {
    if (checked) {
      // Ajoute la valeur si elle est cochée
      onChange([...values, optionValue]);
    } else {
      // Retire la valeur si elle est décochée
      onChange(values.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => {
        const isChecked = values.includes(option.value); // Vérifie si l'option est sélectionnée
        return (
          <div key={option.id || option.value} className="relative">
            {/* Checkbox invisible mais fonctionnelle */}
            <Checkbox
              id={option.id || option.value} // Associe l'ID au label
              checked={isChecked} // Etat coché/décoché
              onCheckedChange={(checked) =>
                handleCheck(option.value, checked as boolean) // Met à jour la sélection
              }
              className="peer sr-only" // Masque visuellement la checkbox mais permet le focus et le style via peer
            />

            {/* Label stylisé comme une carte cliquable */}
            <Label
              htmlFor={option.id || option.value}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all", // Base style
                "hover:border-primary/50 hover:shadow-md", // Style au survol
                "peer-checked:border-primary peer-checked:bg-primary/5", // Style lorsque la checkbox est cochée
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2" // Style au focus pour accessibilité
              )}
            >
              {/* Texte de l'option */}
              <span className="font-medium">{option.label}</span>

              {/* Case à cocher visuelle */}
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                  isChecked
                    ? "border-primary bg-primary" // Case remplie si cochée
                    : "border-muted-foreground" // Case vide si décochée
                )}
              >
                {isChecked && (
                  // Icône checkmark affichée si cochée
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </Label>
          </div>
        );
      })}
    </div>
  );
};
