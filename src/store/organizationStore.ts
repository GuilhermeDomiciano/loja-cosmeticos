import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Organization {
  id: string;
  nome: string;
}

interface OrganizationState {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      currentOrganization: null,
      setCurrentOrganization: (org) => set({ currentOrganization: org }),
    }),
    {
      name: "organization-storage",
    }
  )
);
