import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useMemo } from 'react';
import { KanbanCard } from './KanbanCard';
import type { ProductionTask } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
interface KanbanColumnProps {
  column: { id: string; title: string };
  tasks: ProductionTask[];
}
export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });
  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-[calc(100vh-20rem)]",
        isOver ? "ring-2 ring-orange-500 bg-orange-500/10" : "bg-muted/40"
      )}
    >
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-lg flex items-center justify-between">
          {column.title}
          <span className="text-sm font-normal bg-background text-muted-foreground rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <ScrollArea>
        <CardContent className="p-4 space-y-4">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}