import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Mobile-first: padding padrão menor para mobile, aumenta em telas maiores
   */
  noPadding?: boolean;
}

/**
 * Container responsivo mobile-first
 * - Mobile: padding 16px (p-4)
 * - Tablet+: padding 24px (md:p-6)
 * - Desktop+: padding 32px (lg:p-8)
 */
export function Container({ children, className, noPadding = false }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto",
        !noPadding && "p-4 md:p-6 lg:p-8",
        "max-w-7xl", // Limita largura máxima em telas muito grandes
        className
      )}
    >
      {children}
    </div>
  );
}
