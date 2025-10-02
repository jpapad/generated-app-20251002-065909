import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserStore } from '@/stores/user-store';
import { api } from '@/lib/api-client';
import type { User, Team } from '@shared/types';
import { toast } from 'sonner';
export function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersData, teamsData] = await Promise.all([
          api<User[]>('/api/users'),
          api<Team[]>('/api/teams'),
        ]);
        setUsers(usersData);
        setTeams(teamsData);
      } catch (error) {
        toast.error('Failed to load login data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedTeamId) {
      toast.warning('Please select a user and a team.');
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(selectedUserId, selectedTeamId);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  const availableTeams = useMemo(() => {
    const selectedUser = users.find(u => u.id === selectedUserId);
    if (!selectedUser) return [];
    return teams.filter(team => selectedUser.teamIds.includes(team.id));
  }, [selectedUserId, users, teams]);
  useEffect(() => {
    if (selectedUserId && !availableTeams.some(t => t.id === selectedTeamId)) {
      setSelectedTeamId(availableTeams[0]?.id || '');
    }
  }, [selectedUserId, availableTeams, selectedTeamId]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <ChefHat className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-display">Welcome to CulinaFlow</CardTitle>
          <CardDescription>Select your profile to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user-select">User Profile</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger id="user-select">
                    <SelectValue placeholder="Select a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-select">Kitchen / Team</Label>
                <Select value={selectedTeamId} onValueChange={setSelectedTeamId} disabled={!selectedUserId}>
                  <SelectTrigger id="team-select">
                    <SelectValue placeholder="Select a team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn || !selectedUserId || !selectedTeamId}>
                {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}