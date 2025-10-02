import { useUserStore } from "@/stores/user-store";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecipeTagsChart } from "@/components/dashboard/RecipeTagsChart";
import { BookOpen, ClipboardCheck, Warehouse, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Recipe, HaccpLog, LibraryItem } from "@shared/types";
async function fetchDashboardStats() {
  const [recipesData, logsData, libraryData] = await Promise.all([
    api<{ items: Recipe[] }>('/api/recipes'),
    api<{ items: HaccpLog[] }>('/api/haccp-logs'),
    api<{ items: LibraryItem[] }>('/api/library-items'),
  ]);
  return {
    recipeCount: recipesData.items.length,
    logCount: logsData.items.length,
    libraryCount: libraryData.items.length,
  };
}
export function HomePage() {
  const user = useUserStore((state) => state.user);
  const activeTeam = useUserStore((state) => state.activeTeam);
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">
          Welcome back, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of the "{activeTeam?.name}" kitchen.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Recipes"
          value={stats?.recipeCount ?? 0}
          icon={<BookOpen className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title="HACCP Logs Today"
          value={0} // This would require more complex backend logic
          icon={<ClipboardCheck className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Library Items"
          value={stats?.libraryCount ?? 0}
          icon={<Warehouse className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Team Members"
          value={1} // Mocked for now
          icon={<Users className="h-4 w-4" />}
          isLoading={isLoading}
        />
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecipeTagsChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
      <footer className="text-center text-sm text-muted-foreground pt-8">
        Built with ❤��� at Cloudflare
      </footer>
    </div>
  );
}