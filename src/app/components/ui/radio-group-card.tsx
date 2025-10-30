"use client";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/app/lib/utils";

interface Option {
  id?: string;
  label: string;
  value: string;
}

interface RadioGroupCardProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroupCard = ({
  options,
  value,
  onChange,
  className,
}: RadioGroupCardProps) => {
  return (
    <RadioGroup value={value} onValueChange={onChange} className={cn("gap-3", className)}>
      {options.map((option) => (
        <div key={option.id || option.value} className="relative">
          <RadioGroupItem
            value={option.value}
            id={option.id || option.value}
            className="peer sr-only"
          />
          <Label
            htmlFor={option.id || option.value}
            className={cn(
              "checkbox-card flex items-center justify-between p-4 cursor-pointer transition-all", // Classe CSS globale
              "hover:border-primary/50 hover:shadow-md",
              "peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-lg",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
            )}
          >
            <span className="font-medium text-card-foreground">{option.label}</span>
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                value === option.value
                  ? "border-primary bg-primary shadow-inner"
                  : "border-border bg-card"
              )}
            >
              {value === option.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
              )}
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};