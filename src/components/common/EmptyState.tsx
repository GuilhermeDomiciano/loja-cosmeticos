import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Empty state component mobile-first
 * - Mobile: padding menor, texto menor
 * - Desktop: padding maior, texto maior
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "p-8 md:p-12 lg:p-16",
        "rounded-lg border-2 border-dashed",
        className
      )}
    >
      {Icon && (
        <div className="rounded-full bg-muted p-4 md:p-6 mb-4">
          <Icon className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
        </div>
      )}
      
      <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick} size="lg" className="w-full md:w-auto">
          {action.label}
        </Button>
      )}
    </div>
  );
}
