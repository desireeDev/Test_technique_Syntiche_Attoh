"use client";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/app/(backend)/lib/utils";
//Interface option pour les cases à cocher
interface Option {
  id?: string;
  label: string;
  value: string;
}
//Props pour le composant CheckboxGroupCard
interface CheckboxGroupCardProps {
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}
//Composant CheckboxGroupCard
export const CheckboxGroupCard = ({
  options,
  values,
  onChange,
  className,
}: CheckboxGroupCardProps) => {
  const handleCheck = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...values, optionValue]);
    } else {
      onChange(values.filter((v) => v !== optionValue));
    }
  };
//Rendu du composant
  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => {
        const isChecked = values.includes(option.value);
        return (
          <div key={option.id || option.value} className="relative">
            {/* Checkboxe */}
            <Checkbox
              id={option.id || option.value}
              checked={isChecked}
              onCheckedChange={(checked) =>
                handleCheck(option.value, checked as boolean)
              }
              className="absolute" // Retirer "peer" car on utilise une approche différente
            />

            {/* Label stylisé comme une carte cliquable avec data attribute */}
            <Label
              htmlFor={option.id || option.value}
              className={cn(
                "checkbox-card flex items-center justify-between p-4 cursor-pointer transition-all",
                "border-2 border-border rounded-lg bg-card",
                "hover:border-primary/50 hover:bg-accent",
                isChecked && "border-primary bg-primary/5 shadow-lg" // Style conditionnel direct
              )}
              data-checked={isChecked} // Data attribute pour le CSS
            >
              {/* Texte de l'option */}
              <span className="font-medium text-card-foreground">{option.label}</span>

              {/* Case à cocher visuelle */}
              <div
                className={cn(
                  "w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200",
                  isChecked
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/25 bg-background"
                )}
              >
                {isChecked && (
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
