import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Thermometer, Refrigerator, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { HaccpForm, HaccpLog, User } from '@shared/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
const iconMap: { [key: string]: React.ElementType } = {
  'Temperature Control': Thermometer,
  'Sanitation': ClipboardCheck,
  'Default': Refrigerator,
};
export function HaccpFormsPage() {
  const [forms, setForms] = useState<HaccpForm[]>([]);
  const [logs, setLogs] = useState<HaccpLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [formsData, logsData, usersData] = await Promise.all([
          api<{ items: HaccpForm[] }>('/api/haccp-forms'),
          api<{ items: HaccpLog[] }>('/api/haccp-logs'),
          api<User[]>('/api/users'),
        ]);
        setForms(formsData.items);
        setLogs(logsData.items);
        setUsers(usersData);
      } catch (error) {
        toast.error('Failed to load HACCP data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown User';
  const getFormTitle = (formId: string) => forms.find(f => f.id === formId)?.title || 'Unknown Form';
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">HACCP Compliance</h1>
        <p className="text-muted-foreground">
          Manage and complete your daily food safety and hygiene forms.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
        ) : (
          forms.map((form) => {
            const Icon = iconMap[form.category] || iconMap['Default'];
            return (
              <Card key={form.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="p-3 bg-muted rounded-md">
                    <Icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>{form.title}</CardTitle>
                    <CardDescription>{form.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Badge variant="outline">{form.category}</Badge>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link to={`/haccp/${form.id}`}>Fill Out Form</Link>
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>A history of recently submitted HACCP forms.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length > 0 ? (
                logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{getFormTitle(log.formId)}</TableCell>
                    <TableCell>{getUserName(log.submittedBy)}</TableCell>
                    <TableCell>{format(new Date(log.submittedAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30">
                        Completed
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    No logs submitted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}