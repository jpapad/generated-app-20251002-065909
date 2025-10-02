import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { HaccpLog, Recipe, User } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
type ActivityItem = (Recipe & { type: 'recipe' }) | (HaccpLog & { type: 'haccp' });
async function fetchDashboardData() {
  const [recipesData, logsData, usersData] = await Promise.all([
    api<{ items: Recipe[] }>('/api/recipes'),
    api<{ items: HaccpLog[] }>('/api/haccp-logs'),
    api<User[]>('/api/users'),
  ]);
  return { recipes: recipesData.items, logs: logsData.items, users: usersData };
}
export function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });
  const activities: ActivityItem[] = [
    ...(data?.recipes.map(r => ({ ...r, type: 'recipe' as const })) || []),
    ...(data?.logs.map(l => ({ ...l, type: 'haccp' as const })) || []),
  ].sort((a, b) => {
    const dateA = a.type === 'recipe' ? a.createdAt : a.submittedAt;
    const dateB = b.type === 'recipe' ? b.createdAt : b.submittedAt;
    return dateB - dateA;
  }).slice(0, 5);
  const getUserInitials = (userId: string) => {
    const user = data?.users.find(u => u.id === userId);
    return user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>A log of the latest actions in your kitchen.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {activity.type === 'recipe' ? 'RE' : getUserInitials(activity.submittedBy)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1 text-sm">
                  <p className="font-medium leading-none">
                    {activity.type === 'recipe' ? `New Recipe Added` : `HACCP Form Submitted`}
                  </p>
                  <p className="text-muted-foreground">
                    {activity.type === 'recipe' ? activity.title : `Form ID: ...${activity.formId.slice(-6)}`}
                  </p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.type === 'recipe' ? activity.createdAt : activity.submittedAt), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}