"use client";
import { RadioGroup, RadioGroupItem } from "@/components/Ui/radio-group";
import { Label } from "@/components/Ui/label";
import { cn } from "@/app/(backend)/lib/utils";

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
    <RadioGroup value={value} onValueChange={onChange} className={cn("radio-group", className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <Label
            key={option.id || option.value}
            htmlFor={option.id || option.value}
            className={cn("checkbox-card", isSelected && "data-[checked=true]")}
            data-checked={isSelected}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-[var(--card-foreground)]">{option.label}</span>

              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  isSelected
                    ? "border-[var(--primary)] bg-[var(--primary)]"
                    : "border-[var(--muted-foreground)]/30 bg-[var(--background)]"
                )}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-foreground)]" />
                )}
              </div>
            </div>

            {/* Élément Radio invisible mais fonctionnel */}
            <RadioGroupItem
              value={option.value}
              id={option.id || option.value}
              className="absolute opacity-0 pointer-events-none"
            />
          </Label>
        );
      })}
    </RadioGroup>
  );
};
