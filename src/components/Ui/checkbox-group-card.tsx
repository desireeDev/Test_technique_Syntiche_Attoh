"use client";
import { Checkbox } from "@/components/Ui/checkbox";
import { Label } from "@/components/Ui/label";
import { cn } from "@/app/(backend)/lib/utils";
// Définition des types pour les options et les props du composant  
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
// Composant : CheckboxGroupCard
// ------------------------------------------------------------
// Objectif : afficher un groupe de cases à cocher sous forme de cartes sélectionnables
export const CheckboxGroupCard = ({
  options,
  values,
  onChange,
  className,
}: CheckboxGroupCardProps) => {
  const handleCheck = (optionValue: string, checked: boolean) => {
    if (checked) onChange([...values, optionValue]);
    else onChange(values.filter((v) => v !== optionValue));
  };
// Rendu du composant
  return (
    <div className={cn("checkbox-group", className)}>
      {options.map((option) => {
        const isChecked = values.includes(option.value);
        return (
          <Label
            key={option.id || option.value}
            htmlFor={option.id || option.value}
            className={cn("checkbox-card", isChecked && "data-[checked=true]")}
            data-checked={isChecked}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                id={option.id || option.value}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleCheck(option.value, checked as boolean)
                }
              />
              <span className="font-medium text-card-foreground">
                {option.label}
              </span>
            </div>
          </Label>
        );
      })}
    </div>
  );
};