import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { format, addDays, startOfWeek, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { DraggableRecipeCard } from '@/components/dnd/DraggableRecipeCard';
import { DroppableDaySlot } from '@/components/dnd/DroppableDaySlot';
import { api } from '@/lib/api-client';
import type { Recipe, DailyMenu } from '@shared/types';
import { toast } from 'sonner';
type MenuItems = { [key: string]: Recipe[] };
export function MenuPlannerPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [menuItems, setMenuItems] = useState<MenuItems>({});
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i);
    return {
      date: day,
      dateString: format(day, 'yyyy-MM-dd'),
      name: format(day, 'eeee'),
    };
  });
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoadingRecipes(true);
        const data = await api<{ items: Recipe[] }>('/api/recipes');
        setRecipes(data.items);
      } catch (error) {
        toast.error('Failed to fetch recipes.');
      } finally {
        setIsLoadingRecipes(false);
      }
    };
    fetchRecipes();
  }, []);
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const recipe = recipes.find(r => r.id === active.id);
    if (recipe) {
      setActiveRecipe(recipe);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveRecipe(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const recipeToAdd = recipes.find(r => r.id === active.id);
      if (!recipeToAdd) return;
      const dayKey = over.id.toString();
      setMenuItems(prev => {
        const dayMenu = prev[dayKey] || [];
        // Avoid adding duplicates
        if (dayMenu.some(r => r.id === recipeToAdd.id)) {
          return prev;
        }
        return {
          ...prev,
          [dayKey]: [...dayMenu, recipeToAdd],
        };
      });
    }
  };
  const removeRecipeFromDay = (day: string, recipeId: string) => {
    setMenuItems(prev => ({
      ...prev,
      [day]: prev[day].filter(r => r.id !== recipeId),
    }));
  };
  const goToPreviousWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-10rem)]">
        {/* Recipe List Sidebar */}
        <Card className="w-full lg:w-1/4 lg:max-w-sm flex flex-col">
          <CardHeader>
            <CardTitle>Available Recipes</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {isLoadingRecipes ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <SortableContext items={recipes.map(r => r.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {recipes.map(recipe => (
                      <DraggableRecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                </SortableContext>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        {/* Weekly Calendar */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {format(weekDays[0].date, 'MMM d')} - {format(weekDays[6].date, 'MMM d, yyyy')}
            </h2>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 flex-1">
            {weekDays.map(day => (
              <DroppableDaySlot
                key={day.dateString}
                day={day}
                recipes={menuItems[day.dateString] || []}
                onRemoveRecipe={removeRecipeFromDay}
              />
            ))}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeRecipe ? (
          <Card className="p-2 flex items-center gap-2 bg-background shadow-lg cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{activeRecipe.title}</span>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}