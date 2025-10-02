import { useTheme } from "@/hooks/use-theme";
import { useUserStore } from "@/stores/user-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
export function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const activeTeam = useUserStore((state) => state.activeTeam);
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user?.name || ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user?.role || ''} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Active Team</Label>
            <Input id="team" value={activeTeam?.name || ''} readOnly />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Theme</Label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => !isDark && toggleTheme()}
              className={cn(isDark && "bg-primary text-primary-foreground")}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              variant="outline"
              onClick={() => isDark && toggleTheme()}
              className={cn(!isDark && "bg-primary text-primary-foreground")}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button variant="outline" disabled>
              <Monitor className="mr-2 h-4 w-4" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>Manage your team members and roles. (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            <p>Advanced team management features are under development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}