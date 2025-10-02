import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import type { ProductionTask } from '@shared/types';
interface KanbanBoardProps {
  tasks: ProductionTask[];
  onTaskUpdate: (task: ProductionTask) => void;
  columns: { id: string; title: string }[];
}
export function KanbanBoard({ tasks, onTaskUpdate, columns }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<ProductionTask | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeTask) return;
    const overId = over.id;
    const overIsColumn = over.data.current?.type === 'Column';
    if (overIsColumn && activeTask.station !== overId) {
      onTaskUpdate({ ...activeTask, station: overId as string });
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        <SortableContext items={columns.map(c => c.id)}>
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.station === col.id)}
            />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeTask && <KanbanCard task={activeTask} />}
      </DragOverlay>
    </DndContext>
  );
}