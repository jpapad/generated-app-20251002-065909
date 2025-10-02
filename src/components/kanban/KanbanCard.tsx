import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ProductionTask } from '@shared/types';
import { cn } from '@/lib/utils';
interface KanbanCardProps {
  task: ProductionTask;
}
export function KanbanCard({ task }: KanbanCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const getAssigneeInitials = (id: string) => (id === 'u1' ? 'CA' : 'SM');
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-background hover:shadow-md cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-sm leading-tight">{task.recipeTitle}</p>
          <Badge
            variant={
              task.status === 'Done' ? 'default' : task.status === 'InProgress' ? 'secondary' : 'outline'
            }
            className={cn(
                task.status === 'Done' && 'bg-green-500/20 text-green-700 border-green-500/30',
                task.status === 'InProgress' && 'bg-blue-500/20 text-blue-700 border-blue-500/30'
            )}
          >
            {task.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">Recipe ID: ...{task.recipeId.slice(-6)}</span>
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {getAssigneeInitials(task.assigneeId)}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}