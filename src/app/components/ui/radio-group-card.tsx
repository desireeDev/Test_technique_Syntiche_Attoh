  // Composant RadioGroupCard réutilisable
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/app/lib/utils";
// Utilitaire pour concaténer des classes conditionnellement
// Définition d'une option individuelle du groupe de radio
interface Option {
  id?: string;
  label: string;
  value: string;
}
// Props attendues par le composant RadioGroupCard
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
              "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
              "hover:border-primary/50 hover:shadow-md",
              "peer-checked:border-primary peer-checked:bg-primary/5",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
            )}
          >
            <span className="font-medium">{option.label}</span>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                value === option.value
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              )}
            >
              {value === option.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
