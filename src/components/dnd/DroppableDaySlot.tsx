import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Recipe } from '@shared/types';
interface DroppableDaySlotProps {
  day: { date: Date; dateString: string; name: string };
  recipes: Recipe[];
  onRemoveRecipe: (day: string, recipeId: string) => void;
}
export function DroppableDaySlot({ day, recipes, onRemoveRecipe }: DroppableDaySlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: day.dateString,
  });
  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-full transition-colors',
        isOver ? 'bg-orange-500/10 border-orange-500' : 'bg-muted/40'
      )}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <span>{day.name}</span>
          <span className="text-sm font-normal text-muted-foreground">{day.date.getDate()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-2 min-h-[100px]">
            {recipes.map(recipe => (
              <Badge key={recipe.id} variant="secondary" className="p-1 pl-2 text-sm w-full flex justify-between items-center">
                <span className="truncate mr-2">{recipe.title}</span>
                <button
                  onClick={() => onRemoveRecipe(day.dateString, recipe.id)}
                  className="rounded-full hover:bg-destructive/20 p-0.5"
                >
                  <X className="h-3 w-3 text-destructive" />
                </button>
              </Badge>
            ))}
            {recipes.length === 0 && (
              <div className="text-center text-xs text-muted-foreground pt-8">
                Drop recipes here
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}