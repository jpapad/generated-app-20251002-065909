import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { useProductionTasks, useUpdateProductionTask, useKitchenStations } from '@/hooks/useProductionData';
import { ProductionTask } from '@shared/types';
import { useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
export function ProductionSchedulePage() {
  const { data: tasksData, isLoading: isLoadingTasks, error: tasksError } = useProductionTasks();
  const { data: stations, isLoading: isLoadingStations, error: stationsError } = useKitchenStations();
  const { mutate: updateTask } = useUpdateProductionTask();
  const handleTaskUpdate = useCallback((updatedTask: ProductionTask) => {
    updateTask(updatedTask);
  }, [updateTask]);
  const isLoading = isLoadingTasks || isLoadingStations;
  const error = tasksError || stationsError;
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load production schedule data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  const columns = stations?.map(station => ({ id: station.id, title: station.name })) || [];
  const tasks = tasksData?.items || [];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Production Schedule</h1>
        <p className="text-muted-foreground">
          Organize and track preparation tasks across kitchen stations.
        </p>
      </div>
      <KanbanBoard
        tasks={tasks}
        columns={columns}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}