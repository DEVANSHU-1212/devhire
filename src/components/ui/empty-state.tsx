import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 text-blue-400 mb-4 shadow-inner">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="mt-1 max-w-sm text-xs text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="primary" className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
