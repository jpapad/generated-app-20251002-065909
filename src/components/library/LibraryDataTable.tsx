import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { LibraryItem, LibraryItemCategory } from "@shared/types";
import { LibraryItemForm } from "./LibraryItemForm";
import { usePermissions } from "@/hooks/usePermissions";
interface LibraryDataTableProps {
  category: LibraryItemCategory;
}
export function LibraryDataTable({ category }: LibraryDataTableProps) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const { canCreate, canEdit, canDelete } = usePermissions();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const data = await api<{ items: LibraryItem[] }>(`/api/library-items?category=${category}`);
        setItems(data.items);
      } catch (error) {
        toast.error(`Failed to fetch ${category.toLowerCase()} items.`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [category]);
  const handleFormSubmit = (item: LibraryItem) => {
    if (editingItem) {
      setItems(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      setItems([...items, item]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };
  const handleDelete = async () => {
    if (!deletingItemId) return;
    const promise = api(`/api/library-items/${deletingItemId}`, { method: "DELETE" });
    toast.promise(promise, {
      loading: "Deleting item...",
      success: () => {
        setItems(items.filter((item) => item.id !== deletingItemId));
        setDeletingItemId(null);
        return "Item deleted successfully!";
      },
      error: "Failed to delete item.",
    });
  };
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{categoryTitle}</CardTitle>
          <CardDescription>Manage all {category.toLowerCase()} items in your library.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder={`Filter ${category.toLowerCase()}...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
            {canCreate && (
              <Button onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New
              </Button>
            )}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  {(canEdit || canDelete) && <TableHead><span className="sr-only">Actions</span></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.supplier || 'N/A'}</TableCell>
                      <TableCell className="text-right">{item.stock} {item.unit}</TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="float-right">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {canEdit && (
                                <DropdownMenuItem onSelect={() => { setEditingItem(item); setIsFormOpen(true); }}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete && (
                                <DropdownMenuItem onSelect={() => setDeletingItemId(item.id)} className="text-red-500">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} {categoryTitle} Item</DialogTitle>
            <DialogDescription>
              Fill in the details for the library item.
            </DialogDescription>
          </DialogHeader>
          <LibraryItemForm
            category={category}
            item={editingItem}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deletingItemId} onOpenChange={(open) => !open && setDeletingItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}