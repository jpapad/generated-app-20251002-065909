import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LibraryItem, LibraryItemCategory, LibraryItemUnit } from "@shared/types";
import { Loader2 } from "lucide-react";
interface LibraryItemFormProps {
  category: LibraryItemCategory;
  item?: LibraryItem | null;
  onSubmit: (item: LibraryItem) => void;
}
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  supplier: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative."),
  unit: z.nativeEnum(LibraryItemUnit),
});
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;
export function LibraryItemForm({ category, item, onSubmit }: LibraryItemFormProps) {
  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      supplier: item?.supplier || "",
      stock: item?.stock || 0,
      unit: item?.unit || LibraryItemUnit.Piece,
    },
  });
  const handleFormSubmit = async (data: FormOutput) => {
    const payload = {
      ...data,
      id: item?.id,
      category,
    };
    const promise = item
      ? api(`/api/library-items/${item.id}`, { method: "PUT", body: JSON.stringify(payload) })
      : api("/api/library-items", { method: "POST", body: JSON.stringify(payload) });
    toast.promise(promise, {
      loading: `${item ? "Updating" : "Creating"} item...`,
      success: (newItem: LibraryItem) => {
        onSubmit(newItem);
        return `Item ${item ? "updated" : "created"} successfully!`;
      },
      error: `Failed to ${item ? "update" : "create"} item.`,
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Olive Oil" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Gourmet Foods Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(LibraryItemUnit).map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {item ? "Save Changes" : "Create Item"}
        </Button>
      </form>
    </Form>
  );
}