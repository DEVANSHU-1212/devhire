import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
  max?: number;
  indicatorClassName?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  indicatorClassName,
  showLabel = false,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span className="font-semibold text-slate-200">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-800", className)}
        {...props}
      >
        <div
          className={cn(
            "h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out",
            indicatorClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
