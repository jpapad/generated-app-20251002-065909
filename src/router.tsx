import { createBrowserRouter } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { HomePage } from "@/pages/HomePage";
import { MainLayout } from "@/components/layout/MainLayout";
import { RecipesPage } from "@/pages/recipes/RecipesPage";
import { RecipeEditorPage } from "@/pages/recipes/RecipeEditorPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { MenuPlannerPage } from "@/pages/menus/MenuPlannerPage";
import { BuffetDesignerPage } from "@/pages/buffet/BuffetDesignerPage";
import { ProductionSchedulePage } from "@/pages/production/ProductionSchedulePage";
import { HaccpFormsPage } from "@/pages/haccp/HaccpFormsPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { HaccpFormViewerPage } from "@/pages/haccp/HaccpFormViewerPage";
import { LibraryPage } from "@/pages/library/LibraryPage";
import { SettingsPage } from "@/pages/SettingsPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "recipes",
            element: <RecipesPage />,
          },
          {
            path: "recipes/new",
            element: <RecipeEditorPage />,
          },
          {
            path: "recipes/:id/edit",
            element: <RecipeEditorPage />,
          },
          { path: "menus", element: <MenuPlannerPage /> },
          { path: "buffet", element: <BuffetDesignerPage /> },
          { path: "production", element: <ProductionSchedulePage /> },
          { path: "haccp", element: <HaccpFormsPage /> },
          { path: "haccp/:formId", element: <HaccpFormViewerPage /> },
          { path: "library", element: <LibraryPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);