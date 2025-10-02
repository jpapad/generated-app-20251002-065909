import type { User, Recipe, Team, HaccpForm, LibraryItem } from './types';
import { Allergen, UserRole, LibraryItemCategory, LibraryItemUnit } from './types';
export const MOCK_TEAMS: Team[] = [
  { id: 'team1', name: 'Grand Hotel Kitchen' },
  { id: 'team2', name: 'Seaside Resort Catering' },
  { id: 'team3', name: 'Downtown Bistro' },
];
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Chef Antoine', role: UserRole.Chef, teamIds: ['team1', 'team3'] },
  { id: 'u2', name: 'Sous-Chef Marie', role: UserRole.SousChef, teamIds: ['team1'] },
  { id: 'u3', name: 'Cook David', role: UserRole.Cook, teamIds: ['team2'] },
  { id: 'u4', name: 'Manager Sofia', role: UserRole.Manager, teamIds: ['team1', 'team2', 'team3'] },
];
export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    title: 'Classic Greek Salad',
    description: 'A refreshing and authentic Greek salad with fresh vegetables, feta cheese, and a lemon-oregano vinaigrette.',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    ingredients: [
      { id: 'ing1', name: 'Tomatoes', quantity: 4, unit: 'large' },
      { id: 'ing2', name: 'Cucumber', quantity: 1, unit: 'large' },
      { id: 'ing3', name: 'Red Onion', quantity: 0.5, unit: 'large' },
      { id: 'ing4', name: 'Kalamata Olives', quantity: 1, unit: 'cup' },
      { id: 'ing5', name: 'Feta Cheese', quantity: 200, unit: 'g' },
      { id: 'ing6', name: 'Extra Virgin Olive Oil', quantity: 0.25, unit: 'cup' },
      { id: 'ing7', name: 'Lemon Juice', quantity: 1, unit: 'lemon' },
      { id: 'ing8', name: 'Dried Oregano', quantity: 1, unit: 'tsp' },
    ],
    instructions: [
      { id: 'step1', step: 1, description: 'Chop tomatoes, cucumber, and red onion. Add to a large bowl.' },
      { id: 'step2', step: 2, description: 'Add Kalamata olives and gently toss.' },
      { id: 'step3', step: 3, description: 'In a small bowl, whisk together olive oil, lemon juice, and oregano.' },
      { id: 'step4', step: 4, description: 'Pour dressing over the salad. Crumble feta cheese on top before serving.' },
    ],
    allergens: [Allergen.Milk],
    tags: ['salad', 'greek', 'vegetarian', 'gluten-free'],
    costPerServing: 3.50,
    calories: 350,
    imageUrl: 'https://images.unsplash.com/photo-1592417817038-d13fd7342605?q=80&w=800',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    title: 'Mushroom Risotto',
    description: 'A creamy and savory risotto made with Arborio rice, mixed mushrooms, and Parmesan cheese.',
    prepTime: 10,
    cookTime: 30,
    servings: 2,
    ingredients: [
      { id: 'ing1', name: 'Arborio Rice', quantity: 1, unit: 'cup' },
      { id: 'ing2', name: 'Mixed Mushrooms', quantity: 500, unit: 'g' },
      { id: 'ing3', name: 'Vegetable Broth', quantity: 4, unit: 'cups' },
      { id: 'ing4', name: 'Dry White Wine', quantity: 0.5, unit: 'cup' },
      { id: 'ing5', name: 'Parmesan Cheese', quantity: 0.5, unit: 'cup' },
      { id: 'ing6', name: 'Shallot', quantity: 1, unit: 'medium' },
      { id: 'ing7', name: 'Garlic', quantity: 2, unit: 'cloves' },
      { id: 'ing8', name: 'Butter', quantity: 2, unit: 'tbsp' },
    ],
    instructions: [
      { id: 'step1', step: 1, description: 'In a large pot, melt butter and sauté chopped shallot and garlic until fragrant.' },
      { id: 'step2', step: 2, description: 'Add sliced mushrooms and cook until browned.' },
      { id: 'step3', step: 3, description: 'Add Arborio rice and toast for 1 minute. Deglaze with white wine.' },
      { id: 'step4', step: 4, description: 'Add warm vegetable broth one ladle at a time, stirring constantly until absorbed before adding the next.' },
      { id: 'step5', step: 5, description: 'Once rice is creamy and al dente, stir in Parmesan cheese. Season with salt and pepper.' },
    ],
    allergens: [Allergen.Milk],
    tags: ['risotto', 'italian', 'vegetarian', 'main-course'],
    costPerServing: 5.20,
    calories: 550,
    imageUrl: 'https://images.unsplash.com/photo-1595908129742-874519786916?q=80&w=800',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
export const MOCK_HACCP_FORMS: HaccpForm[] = [
  {
    id: 'temp-log-fridges',
    title: 'Refrigerator Temperature Log',
    description: 'Daily temperature checks for all refrigerators and freezers.',
    category: 'Temperature Control',
    fields: [
      { id: 'fridge1_temp', label: 'Walk-in Fridge (°C)', type: 'number' },
      { id: 'fridge2_temp', label: 'Reach-in Fridge 1 (°C)', type: 'number' },
      { id: 'freezer1_temp', label: 'Walk-in Freezer (°C)', type: 'number' },
      { id: 'corrective_action', label: 'Corrective Action Taken', type: 'text' },
    ],
  },
  {
    id: 'cleaning-schedule',
    title: 'Kitchen Cleaning Schedule',
    description: 'Weekly deep cleaning checklist for all kitchen areas.',
    category: 'Sanitation',
    fields: [
      { id: 'floors_cleaned', label: 'Floors Mopped & Sanitized', type: 'boolean' },
      { id: 'surfaces_sanitized', label: 'All Surfaces Sanitized', type: 'boolean' },
      { id: 'equipment_cleaned', label: 'Major Equipment Cleaned', type: 'boolean' },
      { id: 'notes', label: 'Additional Notes', type: 'text' },
    ],
  },
  {
    id: 'cooking-temp-log',
    title: 'Cooking Temperature Log',
    description: 'Record final cooking temperatures for high-risk items.',
    category: 'Temperature Control',
    fields: [
      { id: 'item_name', label: 'Food Item', type: 'text' },
      { id: 'final_temp', label: 'Final Temperature (°C)', type: 'number' },
      { id: 'is_safe', label: 'Temperature is Safe (>75°C)', type: 'boolean' },
    ],
  },
];
export const MOCK_LIBRARY_ITEMS: LibraryItem[] = [
    { id: 'lib-1', name: 'Extra Virgin Olive Oil', category: LibraryItemCategory.Ingredient, supplier: 'Gourmet Foods Inc.', stock: 12, unit: LibraryItemUnit.Bottle, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 'lib-2', name: 'All-Purpose Flour', category: LibraryItemCategory.Ingredient, supplier: 'Bulk Supplies Co.', stock: 50, unit: LibraryItemUnit.Kilogram, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 'lib-3', name: 'Stand Mixer', category: LibraryItemCategory.Equipment, supplier: 'KitchenAid', stock: 2, unit: LibraryItemUnit.Piece, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 'lib-4', name: 'Chef\'s Knife 8"', category: LibraryItemCategory.Equipment, supplier: 'Wüsthof', stock: 5, unit: LibraryItemUnit.Piece, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 'lib-5', name: 'All-Purpose Cleaner', category: LibraryItemCategory.Cleaning, supplier: 'EcoClean', stock: 20, unit: LibraryItemUnit.Liter, createdAt: Date.now(), updatedAt: Date.now() },
    { id: 'lib-6', name: 'Heavy-Duty Degreaser', category: LibraryItemCategory.Cleaning, supplier: 'Bulk Supplies Co.', stock: 8, unit: LibraryItemUnit.Can, createdAt: Date.now(), updatedAt: Date.now() },
];