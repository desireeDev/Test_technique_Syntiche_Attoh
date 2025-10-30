//fichier pour la barre de progression
import { cn } from "@/app/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar = ({ current, total, className }: ProgressBarProps) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {current} of {total}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
