"use client";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/app/lib/utils";

// Définition d'une option individuelle du groupe de checkbox
interface Option {
  id?: string;
  label: string;
  value: string;
}

// Props attendues par le composant CheckboxGroupCard
interface CheckboxGroupCardProps {
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
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
      onChange([...values, optionValue]);
    } else {
      onChange(values.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => {
        const isChecked = values.includes(option.value);
        return (
          <div key={option.id || option.value} className="relative">
            {/* Checkbox invisible mais fonctionnelle */}
            <Checkbox
              id={option.id || option.value}
              checked={isChecked}
              onCheckedChange={(checked) =>
                handleCheck(option.value, checked as boolean)
              }
              className="peer sr-only"
            />

            {/* Label stylisé comme une carte cliquable avec classes CSS globales */}
            <Label
              htmlFor={option.id || option.value}
              className={cn(
                "checkbox-card flex items-center justify-between p-4 cursor-pointer transition-all", // Utilise la classe CSS globale
                "hover:border-primary/50 hover:shadow-md",
                "peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-lg", // Amélioré avec shadow-lg
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
              )}
            >
              {/* Texte de l'option */}
              <span className="font-medium text-card-foreground">{option.label}</span>

              {/* Case à cocher visuelle améliorée */}
              <div
                className={cn(
                  "w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200",
                  isChecked
                    ? "border-primary bg-primary shadow-inner" // Amélioré avec shadow
                    : "border-border bg-card" // Utilise les variables CSS globales
                )}
              >
                {isChecked && (
                  // Icône checkmark améliorée
                  <svg
                    className="w-3.5 h-3.5 text-primary-foreground"
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