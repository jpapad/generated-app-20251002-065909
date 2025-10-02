import { IndexedEntity } from "./core-utils";
import type { User, Recipe, Menu, Buffet, ProductionTask, HaccpLog, LibraryItem } from "@shared/types";
import { MOCK_RECIPES, MOCK_USERS, MOCK_LIBRARY_ITEMS } from "@shared/mock-data";
import { UserRole, LibraryItemCategory, LibraryItemUnit } from "@shared/types";
// USER ENTITY
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", role: UserRole.Cook, teamIds: [] };
  static seedData = MOCK_USERS;
}
// RECIPE ENTITY
export type RecipeState = Recipe;
export class RecipeEntity extends IndexedEntity<RecipeState> {
  static readonly entityName = "recipe";
  static readonly indexName = "recipes";
  static readonly initialState: RecipeState = {
    id: "",
    title: "",
    description: "",
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    ingredients: [],
    instructions: [],
    allergens: [],
    tags: [],
    createdAt: 0,
    updatedAt: 0,
  };
  static seedData = MOCK_RECIPES;
}
// MENU ENTITY
export class MenuEntity extends IndexedEntity<Menu> {
  static readonly entityName = "menu";
  static readonly indexName = "menus";
  static readonly initialState: Menu = {
    id: "",
    days: [],
  };
}
// BUFFET ENTITY
export class BuffetEntity extends IndexedEntity<Buffet> {
  static readonly entityName = "buffet";
  static readonly indexName = "buffets";
  static readonly initialState: Buffet = {
    id: "",
    title: "",
    guestCount: 0,
    items: [],
    createdAt: 0,
    updatedAt: 0,
  };
}
// PRODUCTION TASK ENTITY
export class ProductionTaskEntity extends IndexedEntity<ProductionTask> {
  static readonly entityName = "productionTask";
  static readonly indexName = "productionTasks";
  static readonly initialState: ProductionTask = {
    id: "",
    recipeId: "",
    recipeTitle: "",
    station: "",
    status: "Todo",
    assigneeId: "",
    order: 0,
  };
}
// HACCP LOG ENTITY
export class HaccpLogEntity extends IndexedEntity<HaccpLog> {
  static readonly entityName = "haccpLog";
  static readonly indexName = "haccpLogs";
  static readonly initialState: HaccpLog = {
    id: "",
    formId: "",
    submittedBy: "",
    submittedAt: 0,
    data: {},
  };
}
// LIBRARY ITEM ENTITY
export class LibraryItemEntity extends IndexedEntity<LibraryItem> {
  static readonly entityName = "libraryItem";
  static readonly indexName = "libraryItems";
  static readonly initialState: LibraryItem = {
    id: "",
    name: "",
    category: LibraryItemCategory.Ingredient,
    stock: 0,
    unit: LibraryItemUnit.Piece,
    createdAt: 0,
    updatedAt: 0,
  };
  static seedData = MOCK_LIBRARY_ITEMS;
}