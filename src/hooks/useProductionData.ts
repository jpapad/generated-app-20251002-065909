import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ProductionTask } from '@shared/types';
import { toast } from 'sonner';
// Mocked kitchen stations as there is no backend endpoint for it.
const MOCK_STATIONS = [
  { id: 'Prep', name: 'Prep Station' },
  { id: 'Grill', name: 'Grill' },
  { id: 'Pastry', name: 'Pastry' },
  { id: 'Done', name: 'Completed' },
];
// Hook to get kitchen stations
export const useKitchenStations = () => {
  return useQuery({
    queryKey: ['kitchenStations'],
    queryFn: async () => {
      // In a real app, this would be an API call.
      return Promise.resolve(MOCK_STATIONS);
    },
  });
};
// Hook to fetch all production tasks
export const useProductionTasks = () => {
  return useQuery<{ items: ProductionTask[] }>({
    queryKey: ['productionTasks'],
    queryFn: () => api('/api/production-tasks'),
  });
};
// Hook to update a production task
export const useUpdateProductionTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: ProductionTask) => api(`/api/production-tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionTasks'] });
      toast.success('Task updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update task.');
    },
  });
};