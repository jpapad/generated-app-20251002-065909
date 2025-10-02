import {
  BookOpen,
  Calendar,
  ChefHat,
  ClipboardList,
  Home,
  LayoutGrid,
  Settings,
  Warehouse,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface SidebarProps {
  isCollapsed: boolean;
}
const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/menus", label: "Menu Planner", icon: Calendar },
  { to: "/buffet", label: "Buffet Designer", icon: LayoutGrid },
  { to: "/production", label: "Production", icon: ClipboardList },
  { to: "/haccp", label: "HACCP", icon: ClipboardList },
  { to: "/library", label: "Library", icon: Warehouse },
];
export function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 border-b px-6",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <ChefHat className="h-8 w-8 text-orange-500" />
        {!isCollapsed && (
          <span className="ml-3 text-xl font-bold font-display tracking-tighter">
            CulinaFlow
          </span>
        )}
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-lg p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      isActive && "bg-orange-500/10 text-orange-500 hover:text-orange-600",
                      isCollapsed ? "justify-center" : "justify-start"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-4">{item.label}</span>}
                </NavLink>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <div className="mt-auto border-t p-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-lg p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "bg-muted text-foreground",
                    isCollapsed ? "justify-center" : "justify-start"
                  )
                }
              >
                <Settings className="h-5 w-5" />
                {!isCollapsed && <span className="ml-4">Settings</span>}
              </NavLink>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}