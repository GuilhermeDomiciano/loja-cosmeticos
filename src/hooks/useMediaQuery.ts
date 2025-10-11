"use client";

import { useState, useEffect } from "react";

/**
 * Hook para detectar breakpoints do Tailwind
 * Mobile-first: retorna false durante SSR
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// Helpers para breakpoints comuns
export const useIsSmall = () => useMediaQuery("(min-width: 640px)");
export const useIsMedium = () => useMediaQuery("(min-width: 768px)");
export const useIsLarge = () => useMediaQuery("(min-width: 1024px)");
export const useIsXLarge = () => useMediaQuery("(min-width: 1280px)");

// Helper para saber se é mobile
export const useIsMobile = () => !useMediaQuery("(min-width: 768px)");
