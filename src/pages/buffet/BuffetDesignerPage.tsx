import { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Trash2, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Recipe, BuffetItem, Ingredient } from '@shared/types';
import { toast } from 'sonner';
import { generateBuffetLabelsPDF } from '@/lib/pdf-generator';
import { ScrollArea } from '@/components/ui/scroll-area';
export function BuffetDesignerPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buffetItems, setBuffetItems] = useState<BuffetItem[]>([]);
  const [guestCount, setGuestCount] = useState<number>(50);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await api<{ items: Recipe[] }>('/api/recipes');
        setRecipes(data.items);
      } catch (error) {
        toast.error('Failed to fetch recipes.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);
  const handleAddRecipe = () => {
    if (!selectedRecipeId) {
      toast.warning('Please select a recipe to add.');
      return;
    }
    const recipeToAdd = recipes.find(r => r.id === selectedRecipeId);
    if (recipeToAdd && !buffetItems.some(item => item.recipe.id === selectedRecipeId)) {
      setBuffetItems([...buffetItems, { id: crypto.randomUUID(), recipe: recipeToAdd }]);
      setSelectedRecipeId('');
    } else {
      toast.info('This recipe is already in the buffet.');
    }
  };
  const handleRemoveRecipe = (id: string) => {
    setBuffetItems(buffetItems.filter(item => item.id !== id));
  };
  const totalIngredients = useMemo(() => {
    const ingredientsMap = new Map<string, { quantity: number; unit: string }>();
    buffetItems.forEach(({ recipe }) => {
      const multiplier = guestCount / recipe.servings;
      recipe.ingredients.forEach(ing => {
        const key = `${ing.name.toLowerCase()}-${ing.unit}`;
        const existing = ingredientsMap.get(key) || { quantity: 0, unit: ing.unit };
        ingredientsMap.set(key, {
          quantity: existing.quantity + ing.quantity * multiplier,
          unit: ing.unit,
        });
      });
    });
    return Array.from(ingredientsMap.entries()).map(([nameUnit, data]) => ({
      name: nameUnit.split('-')[0].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
      quantity: parseFloat(data.quantity.toFixed(2)),
      unit: data.unit,
    }));
  }, [buffetItems, guestCount]);
  const handleGeneratePDF = () => {
    if (buffetItems.length === 0) {
      toast.warning('Add some recipes to the buffet before generating labels.');
      return;
    }
    toast.info('Generating PDF...');
    generateBuffetLabelsPDF(buffetItems.map(item => item.recipe));
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Buffet Configuration */}
      <div className="lg:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Buffet Setup</CardTitle>
            <CardDescription>Configure your buffet event details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guest-count">Number of Guests</Label>
                <div className="relative">
                  <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="guest-count"
                    type="number"
                    placeholder="e.g., 50"
                    value={guestCount}
                    onChange={e => setGuestCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add Recipes</CardTitle>
            <CardDescription>Select recipes to add to the buffet.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="flex items-center gap-2">
                <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes.map(recipe => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="icon" onClick={handleAddRecipe}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleGeneratePDF}>
              <Download className="mr-2 h-4 w-4" />
              Generate Food Labels (PDF)
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Buffet Items & Ingredient List */}
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Buffet Menu</CardTitle>
            <CardDescription>List of dishes selected for the buffet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dish</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buffetItems.length > 0 ? (
                  buffetItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.recipe.title}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRecipe(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                      No recipes added to the buffet yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Ingredient List</CardTitle>
            <CardDescription>Aggregated quantities needed for {guestCount} guests.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalIngredients.length > 0 ? (
                    totalIngredients.map(ing => (
                      <TableRow key={ing.name}>
                        <TableCell className="font-medium">{ing.name}</TableCell>
                        <TableCell className="text-right">{ing.quantity}</TableCell>
                        <TableCell>{ing.unit}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                        Add recipes to see the ingredient list.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}