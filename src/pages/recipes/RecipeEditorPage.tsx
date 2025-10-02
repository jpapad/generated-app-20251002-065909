import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Allergen, type Recipe } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, PlusCircle, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const ingredientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().min(0, "Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
});
const instructionSchema = z.object({
  id: z.string(),
  step: z.number(),
  description: z.string().min(1, "Description is required"),
});
const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  prepTime: z.coerce.number().int().min(0),
  cookTime: z.coerce.number().int().min(0),
  servings: z.coerce.number().int().min(1),
  ingredients: z.array(ingredientSchema),
  instructions: z.array(instructionSchema),
  allergens: z.array(z.nativeEnum(Allergen)),
  tags: z.string().optional(),
});
export function RecipeEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      ingredients: [],
      instructions: [],
      allergens: [],
      tags: "",
    },
  });
  const { fields: ingredients, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });
  const { fields: instructions, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control,
    name: "instructions",
  });
  useEffect(() => {
    if (isEditing) {
      const fetchRecipe = async () => {
        try {
          const recipe = await api<Recipe>(`/api/recipes/${id}`);
          form.reset({
            ...recipe,
            tags: recipe.tags?.join(', ') || "",
          });
        } catch (error) {
          toast.error("Failed to load recipe.");
          navigate("/recipes");
        }
      };
      fetchRecipe();
    }
  }, [id, isEditing, navigate, form]);
  const onSubmit: SubmitHandler<z.infer<typeof recipeSchema>> = async (data) => {
    const promise = isEditing
      ? api(`/api/recipes/${id}`, { method: "PUT", body: JSON.stringify(data) })
      : api("/api/recipes", { method: "POST", body: JSON.stringify(data) });
    toast.promise(promise, {
      loading: isEditing ? "Updating recipe..." : "Creating recipe...",
      success: () => {
        navigate("/recipes");
        return `Recipe ${isEditing ? "updated" : "created"} successfully!`;
      },
      error: `Failed to ${isEditing ? "update" : "create"} recipe.`,
    });
  };
  if (isEditing && !form.formState.isDirty && form.formState.isLoading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-28" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold font-display text-center">
            {isEditing ? "Edit Recipe" : "Create New Recipe"}
          </h1>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Recipe"}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Classic Greek Salad" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="A short description of the recipe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ingredients.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2">
                      <FormField control={form.control} name={`ingredients.${index}.quantity`} render={({ field }) => (
                        <FormItem className="w-24"><FormLabel>Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`ingredients.${index}.unit`} render={({ field }) => (
                        <FormItem className="w-32"><FormLabel>Unit</FormLabel><FormControl><Input placeholder="g, ml, cup" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`ingredients.${index}.name`} render={({ field }) => (
                        <FormItem className="flex-1"><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., Tomatoes" {...field} /></FormControl></FormItem>
                      )} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendIngredient({ id: crypto.randomUUID(), name: '', quantity: 0, unit: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instructions.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <span className="font-bold text-lg mt-2">{index + 1}.</span>
                      <FormField control={form.control} name={`instructions.${index}.description`} render={({ field }) => (
                        <FormItem className="flex-1"><FormControl><Textarea placeholder="Describe this step..." {...field} /></FormControl></FormItem>
                      )} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendInstruction({ id: crypto.randomUUID(), step: instructions.length + 1, description: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Step
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="prepTime" render={({ field }) => (
                  <FormItem><FormLabel>Prep Time (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="cookTime" render={({ field }) => (
                  <FormItem><FormLabel>Cook Time (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="servings" render={({ field }) => (
                  <FormItem><FormLabel>Servings</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Tags</CardTitle><CardDescription>Comma-separated</CardDescription></CardHeader>
              <CardContent>
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem><FormControl><Input placeholder="e.g., vegan, gluten-free" {...field} value={field.value || ''} /></FormControl></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Allergens</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="allergens" render={() => (
                  <FormItem className="space-y-2">
                    {Object.values(Allergen).map((allergen) => (
                      <FormField key={allergen} control={form.control} name="allergens" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(allergen)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), allergen])
                                  : field.onChange(field.value?.filter((value) => value !== allergen));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{allergen}</FormLabel>
                        </FormItem>
                      )} />
                    ))}
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}