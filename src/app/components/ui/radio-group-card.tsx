"use client";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/app/(backend)/lib/utils";
//Interface pour les options du RadioGroupCard
interface Option {
  id?: string;
  label: string;
  value: string;
}
//Props pour le composant RadioGroupCard
interface RadioGroupCardProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
//Composant RadioGroupCard
export const RadioGroupCard = ({
  options,
  value,
  onChange,
  className,
}: RadioGroupCardProps) => {
  return (
    <RadioGroup value={value} onValueChange={onChange} className={cn("space-y-3", className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <div key={option.id || option.value} className="relative">
            <RadioGroupItem
              value={option.value}
              id={option.id || option.value}
              className="absolute" 
            />
            <Label
              htmlFor={option.id || option.value}
              className={cn(
                "checkbox-card flex items-center justify-between p-4 cursor-pointer transition-all",
                "border-2 border-border rounded-lg bg-card",
                "hover:border-primary/50 hover:bg-accent",
                isSelected && "border-primary bg-primary/5 shadow-lg" // Style conditionnel direct
              )}
              data-checked={isSelected} // Data attribute pour le CSS
            >
              <span className="font-medium text-card-foreground">{option.label}</span>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/25 bg-background"
                )}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                )}
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};
