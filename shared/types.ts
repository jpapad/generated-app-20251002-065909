export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export enum UserRole {
  Chef = "Chef",
  SousChef = "Sous-Chef",
  Cook = "Cook",
  Cleaner = "Cleaner",
  Manager = "Manager",
}
export interface Team {
  id: string;
  name: string;
}
export interface User {
  id: string;
  name: string;
  role: UserRole;
  teamIds: string[];
}
export enum Allergen {
  Gluten = "Gluten",
  Crustaceans = "Crustaceans",
  Eggs = "Eggs",
  Fish = "Fish",
  Peanuts = "Peanuts",
  Soybeans = "Soybeans",
  Milk = "Milk",
  Nuts = "Nuts",
  Celery = "Celery",
  Mustard = "Mustard",
  Sesame = "Sesame",
  Sulphites = "Sulphites",
  Lupin = "Lupin",
  Molluscs = "Molluscs",
}
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}
export interface InstructionStep {
  id: string;
  step: number;
  description: string;
}
export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  allergens: Allergen[];
  tags: string[];
  costPerServing?: number;
  calories?: number;
  imageUrl?: string;
  createdAt: number; // epoch millis
  updatedAt: number; // epoch millis
}
export interface DailyMenu {
  date: string; // YYYY-MM-DD format
  recipeIds: string[];
}
export interface Menu {
  id: string; // e.g., 'week-2024-34'
  days: DailyMenu[];
}
export interface BuffetItem {
  id: string;
  recipe: Recipe;
}
export interface Buffet {
  id: string;
  title: string;
  guestCount: number;
  items: BuffetItem[];
  createdAt: number;
  updatedAt: number;
}
export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export interface ProductionTask {
  id: string;
  recipeId: string;
  recipeTitle: string;
  station: string; // e.g., 'Prep', 'Grill', 'Pastry'
  status: TaskStatus;
  assigneeId: string;
  order: number; // for sorting within a column
}
export interface HaccpForm {
    id: string;
    title: string;
    description: string;
    category: string;
    fields: { id: string; label: string; type: 'text' | 'number' | 'boolean' }[];
}
export interface HaccpLog {
    id: string;
    formId: string;
    submittedBy: string; // userId
    submittedAt: number; // epoch millis
    data: Record<string, any>;
}
export enum LibraryItemCategory {
    Ingredient = "Ingredient",
    Equipment = "Equipment",
    Cleaning = "Cleaning",
}
export enum LibraryItemUnit {
    Kilogram = "kg",
    Gram = "g",
    Liter = "L",
    Milliliter = "ml",
    Piece = "pc",
    Pack = "pack",
    Bottle = "bottle",
    Can = "can",
}
export interface LibraryItem {
    id: string;
    name: string;
    category: LibraryItemCategory;
    supplier?: string;
    stock: number;
    unit: LibraryItemUnit;
    createdAt: number;
    updatedAt: number;
}