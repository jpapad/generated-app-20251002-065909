import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Team } from '@shared/types';
import { api } from '@/lib/api-client';
interface UserState {
  user: User | null;
  teams: Team[];
  activeTeam: Team | null;
  isAuthenticated: boolean;
  login: (userId: string, teamId: string) => Promise<void>;
  logout: () => void;
  setActiveTeam: (teamId: string) => void;
  fetchTeams: () => Promise<void>;
}
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      teams: [],
      activeTeam: null,
      isAuthenticated: false,
      login: async (userId: string, teamId: string) => {
        const user = await api<User>(`/api/users/${userId}`);
        await get().fetchTeams();
        const teams = get().teams;
        const activeTeam = teams.find(t => t.id === teamId) || teams[0] || null;
        if (user && activeTeam) {
          set({ user, activeTeam, isAuthenticated: true });
        } else {
          throw new Error("Failed to login: User or team not found.");
        }
      },
      logout: () => {
        set({ user: null, activeTeam: null, isAuthenticated: false });
      },
      setActiveTeam: (teamId: string) => {
        const team = get().teams.find(t => t.id === teamId);
        if (team) {
          set({ activeTeam: team });
        }
      },
      fetchTeams: async () => {
        try {
          const teams = await api<Team[]>('/api/teams');
          set({ teams });
        } catch (error) {
          console.error("Failed to fetch teams:", error);
          set({ teams: [] });
        }
      },
    }),
    {
      name: 'culinaflow-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);