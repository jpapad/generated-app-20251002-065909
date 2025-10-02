import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Recipe } from '@shared/types';
interface DraggableRecipeCardProps {
  recipe: Recipe;
}
export function DraggableRecipeCard({ recipe }: DraggableRecipeCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: recipe.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 flex items-center gap-2 bg-background hover:bg-muted cursor-grab active:cursor-grabbing touch-none"
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium text-sm flex-1">{recipe.title}</span>
    </Card>
  );
}