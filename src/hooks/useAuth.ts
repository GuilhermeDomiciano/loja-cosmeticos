"use client";

import { useAuthStore } from "@/store/authStore";
import { useOrganizationStore } from "@/store/organizationStore";

/**
 * Hook para acessar informações de autenticação
 * TODO: Implementar lógica completa na Fase 1
 */
export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const { currentOrganization, setCurrentOrganization } = useOrganizationStore();

  return {
    user,
    isAuthenticated,
    organizationId: currentOrganization?.id,
    organization: currentOrganization,
    setUser,
    setOrganization: setCurrentOrganization,
    logout,
  };
}
