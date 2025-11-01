"use client";
import { cn } from "@/app/(backend)/lib/utils";
// Composant : ProgressBar
// ------------------------------------------------------------
// Objectif : afficher une barre de progression avec pourcentage et étapes
interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}
// Rendu du composant ProgressBar
export const ProgressBar = ({ current, total, className }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className={cn("w-full mb-6 fade-in", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[var(--muted-foreground)]">
          Étape {current} sur {total}
        </span>
        <span className="text-sm font-semibold text-[var(--primary)]">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
