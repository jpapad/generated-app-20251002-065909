import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Recipe } from "@shared/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePermissions } from "@/hooks/usePermissions";
export function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteRecipeId, setDeleteRecipeId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { canCreate, canEdit, canDelete } = usePermissions();
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await api<{ items: Recipe[] }>("/api/recipes");
        setRecipes(data.items);
      } catch (error) {
        toast.error("Failed to fetch recipes.", {
          description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);
  const handleDeleteRecipe = async () => {
    if (!deleteRecipeId) return;
    const promise = api(`/api/recipes/${deleteRecipeId}`, { method: "DELETE" });
    toast.promise(promise, {
      loading: "Deleting recipe...",
      success: () => {
        setRecipes((prev) => prev.filter((r) => r.id !== deleteRecipeId));
        setDeleteRecipeId(null);
        return "Recipe deleted successfully!";
      },
      error: "Failed to delete recipe.",
    });
  };
  const renderSkeleton = () => (
    <TableRow>
      <TableCell colSpan={6}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </TableCell>
    </TableRow>
  );
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Recipe Hub</h1>
          <p className="text-muted-foreground">
            Manage your culinary creations.
          </p>
        </div>
        {canCreate && (
          <Button asChild className="transition-transform hover:scale-105">
            <Link to="/recipes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Recipe
            </Link>
          </Button>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Recipes</CardTitle>
          <CardDescription>
            A list of all recipes in your collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Servings</TableHead>
                <TableHead className="hidden lg:table-cell">Prep Time</TableHead>
                <TableHead className="hidden lg:table-cell">Cook Time</TableHead>
                <TableHead className="hidden md:table-cell">Tags</TableHead>
                {(canEdit || canDelete) && (
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? renderSkeleton()
                : recipes.map((recipe) => (
                    <TableRow key={recipe.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => canEdit && navigate(`/recipes/${recipe.id}/edit`)}>
                      <TableCell className="font-medium">{recipe.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{recipe.servings}</TableCell>
                      <TableCell className="hidden lg:table-cell">{recipe.prepTime} min</TableCell>
                      <TableCell className="hidden lg:table-cell">{recipe.cookTime} min</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {recipe.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {canEdit && (
                                <DropdownMenuItem onSelect={() => navigate(`/recipes/${recipe.id}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete && (
                                <DropdownMenuItem className="text-red-500" onSelect={() => { setDeleteRecipeId(recipe.id) }}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {!isLoading && recipes.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No recipes found.</p>
              {canCreate && (
                <Button variant="link" asChild>
                  <Link to="/recipes/new">Create your first recipe</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={!!deleteRecipeId} onOpenChange={(open) => !open && setDeleteRecipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the recipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecipe} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}