import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, RecipeEntity, MenuEntity, BuffetEntity, ProductionTaskEntity, HaccpLogEntity, LibraryItemEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Recipe, Menu, Buffet, ProductionTask, HaccpLog, User, HaccpForm, LibraryItem } from "@shared/types";
import { MOCK_TEAMS, MOCK_HACCP_FORMS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await UserEntity.ensureSeed(c.env);
    await RecipeEntity.ensureSeed(c.env);
    await LibraryItemEntity.ensureSeed(c.env);
    await next();
  });
  // --- AUTH/USER ROUTES ---
  app.get('/api/users', async (c) => {
    const page = await UserEntity.list(c.env, null, 100);
    return ok(c, page.items);
  });
  app.get('/api/users/:id', async (c) => {
    const { id } = c.req.param();
    const user = new UserEntity(c.env, id);
    if (!(await user.exists())) return notFound(c, 'User not found');
    return ok(c, await user.getState());
  });
  app.get('/api/teams', (c) => {
    return ok(c, MOCK_TEAMS);
  });
  // --- RECIPE CRUD ---
  app.get('/api/recipes', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const limit = lq ? Math.max(1, Math.min(100, Number(lq) | 0)) : 20;
    const page = await RecipeEntity.list(c.env, cq ?? null, limit);
    return ok(c, page);
  });
  app.get('/api/recipes/:id', async (c) => {
    const { id } = c.req.param();
    const recipe = new RecipeEntity(c.env, id);
    if (!(await recipe.exists())) return notFound(c, 'Recipe not found');
    return ok(c, await recipe.getState());
  });
  app.post('/api/recipes', async (c) => {
    const body = await c.req.json<Partial<Recipe> & { tags: string }>();
    if (!body.title || !isStr(body.title)) return bad(c, 'Title is required');
    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || "",
      prepTime: body.prepTime || 0,
      cookTime: body.cookTime || 0,
      servings: body.servings || 1,
      ingredients: body.ingredients || [],
      instructions: body.instructions || [],
      allergens: body.allergens || [],
      tags: body.tags ? body.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      costPerServing: body.costPerServing,
      calories: body.calories,
      imageUrl: body.imageUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await RecipeEntity.create(c.env, newRecipe);
    return ok(c, newRecipe);
  });
  app.put('/api/recipes/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Recipe> & { tags: string }>();
    const recipe = new RecipeEntity(c.env, id);
    if (!(await recipe.exists())) return notFound(c, 'Recipe not found');
    const currentState = await recipe.getState();
    const updatedState: Recipe = { ...currentState, ...body, id, updatedAt: Date.now() };
    if (typeof body.tags === 'string') {
      updatedState.tags = body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    await recipe.save(updatedState);
    return ok(c, updatedState);
  });
  app.delete('/api/recipes/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await RecipeEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Recipe not found');
    return ok(c, { id, deleted: true });
  });
  // --- MENU ROUTES ---
  app.get('/api/menus/:id', async (c) => {
    const { id } = c.req.param(); // e.g., 'week-2024-34'
    const menu = new MenuEntity(c.env, id);
    if (!(await menu.exists())) return ok(c, MenuEntity.initialState);
    return ok(c, await menu.getState());
  });
  app.put('/api/menus/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Menu>>();
    const menu = new MenuEntity(c.env, id);
    const currentState = await menu.exists() ? await menu.getState() : MenuEntity.initialState;
    const updatedState: Menu = { ...currentState, ...body, id };
    await menu.save(updatedState);
    return ok(c, updatedState);
  });
  // --- BUFFET ROUTES ---
  app.get('/api/buffets/:id', async (c) => {
    const { id } = c.req.param();
    const buffet = new BuffetEntity(c.env, id);
    if (!(await buffet.exists())) return notFound(c, 'Buffet not found');
    return ok(c, await buffet.getState());
  });
  app.put('/api/buffets/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Buffet>>();
    const buffet = new BuffetEntity(c.env, id);
    const currentState = await buffet.exists() ? await buffet.getState() : BuffetEntity.initialState;
    const updatedState: Buffet = { ...currentState, ...body, id, updatedAt: Date.now() };
    if (!updatedState.createdAt) updatedState.createdAt = Date.now();
    await buffet.save(updatedState);
    return ok(c, updatedState);
  });
  // --- PRODUCTION TASK ROUTES ---
  app.get('/api/production-tasks', async (c) => {
    const page = await ProductionTaskEntity.list(c.env, null, 100); // Get all for now
    return ok(c, page);
  });
  app.put('/api/production-tasks/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<ProductionTask>>();
    const task = new ProductionTaskEntity(c.env, id);
    if (!(await task.exists())) return notFound(c, 'Task not found');
    const currentState = await task.getState();
    const updatedState: ProductionTask = { ...currentState, ...body, id };
    await task.save(updatedState);
    return ok(c, updatedState);
  });
  // --- HACCP ROUTES ---
  app.get('/api/haccp-forms', (c) => {
    return ok(c, { items: MOCK_HACCP_FORMS });
  });
  app.get('/api/haccp-logs', async (c) => {
    const page = await HaccpLogEntity.list(c.env, null, 50); // Get recent logs
    return ok(c, page);
  });
  app.post('/api/haccp-logs', async (c) => {
    const body = await c.req.json<Partial<HaccpLog>>();
    if (!body.formId || !body.submittedBy) return bad(c, 'Missing required fields');
    const newLog: HaccpLog = {
      id: crypto.randomUUID(),
      formId: body.formId,
      submittedBy: body.submittedBy,
      submittedAt: Date.now(),
      data: body.data || {},
    };
    await HaccpLogEntity.create(c.env, newLog);
    return ok(c, newLog);
  });
  // --- LIBRARY ITEM ROUTES ---
  app.get('/api/library-items', async (c) => {
    const category = c.req.query('category');
    const page = await LibraryItemEntity.list(c.env, null, 200);
    const items = category ? page.items.filter(item => item.category === category) : page.items;
    return ok(c, { items });
  });
  app.post('/api/library-items', async (c) => {
    const body = await c.req.json<Partial<LibraryItem>>();
    if (!body.name || !body.category || body.stock == null || !body.unit) {
      return bad(c, 'Missing required fields');
    }
    const newItem: LibraryItem = {
      id: crypto.randomUUID(),
      name: body.name,
      category: body.category,
      supplier: body.supplier,
      stock: body.stock,
      unit: body.unit,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await LibraryItemEntity.create(c.env, newItem);
    return ok(c, newItem);
  });
  app.put('/api/library-items/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<LibraryItem>>();
    const item = new LibraryItemEntity(c.env, id);
    if (!(await item.exists())) return notFound(c, 'Item not found');
    const currentState = await item.getState();
    const updatedState: LibraryItem = { ...currentState, ...body, id, updatedAt: Date.now() };
    await item.save(updatedState);
    return ok(c, updatedState);
  });
  app.delete('/api/library-items/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await LibraryItemEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Item not found');
    return ok(c, { id, deleted: true });
  });
}