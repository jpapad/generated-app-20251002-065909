import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryDataTable } from "@/components/library/LibraryDataTable";
import { LibraryItemCategory } from "@shared/types";
export function LibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Library</h1>
        <p className="text-muted-foreground">
          Manage your kitchen's ingredients, equipment, and supplies.
        </p>
      </div>
      <Tabs defaultValue={LibraryItemCategory.Ingredient} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value={LibraryItemCategory.Ingredient}>Ingredients</TabsTrigger>
          <TabsTrigger value={LibraryItemCategory.Equipment}>Equipment</TabsTrigger>
          <TabsTrigger value={LibraryItemCategory.Cleaning}>Cleaning</TabsTrigger>
        </TabsList>
        <TabsContent value={LibraryItemCategory.Ingredient}>
          <LibraryDataTable category={LibraryItemCategory.Ingredient} />
        </TabsContent>
        <TabsContent value={LibraryItemCategory.Equipment}>
          <LibraryDataTable category={LibraryItemCategory.Equipment} />
        </TabsContent>
        <TabsContent value={LibraryItemCategory.Cleaning}>
          <LibraryDataTable category={LibraryItemCategory.Cleaning} />
        </TabsContent>
      </Tabs>
    </div>
  );
}