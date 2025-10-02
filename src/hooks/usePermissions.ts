import { useUserStore } from "@/stores/user-store";
import { UserRole } from "@shared/types";
export function usePermissions() {
  const role = useUserStore((state) => state.user?.role);
  if (!role) {
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      isManager: false,
    };
  }
  const isManager = role === UserRole.Manager;
  const isChef = role === UserRole.Chef;
  const isSousChef = role === UserRole.SousChef;
  const canCreate = isManager || isChef || isSousChef;
  const canEdit = isManager || isChef || isSousChef;
  const canDelete = isManager || isChef;
  return {
    canCreate,
    canEdit,
    canDelete,
    isManager,
  };
}