import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useUserStore } from '@/stores/user-store';
import type { HaccpForm, HaccpLog } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
export function HaccpFormViewerPage() {
  const { formId } = useParams<{formId: string;}>();
  const navigate = useNavigate();
  const [formDef, setFormDef] = useState<HaccpForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const formSchema = useMemo(() => {
    if (!formDef) return null;
    const shape: {[key: string]: z.ZodType<any, any>;} = {};
    formDef.fields.forEach((field) => {
      switch (field.type) {
        case 'number':
          shape[field.id] = z.string().min(1, `${field.label} is required.`).pipe(z.coerce.number());
          break;
        case 'boolean':
          shape[field.id] = z.boolean().default(false);
          break;
        case 'text':
        default:
          shape[field.id] = z.string().min(1, `${field.label} is required`);
          break;
      }
    });
    return z.object(shape);
  }, [formDef]);

  useEffect(() => {
    const fetchFormDef = async () => {
      try {
        setIsLoading(true);
        const formsData = await api<{ items: HaccpForm[] }>('/api/haccp-forms');
        const currentForm = formsData.items.find((f) => f.id === formId);
        if (currentForm) {
          setFormDef(currentForm);
        } else {
          toast.error('HACCP form not found.');
          navigate('/haccp');
        }
      } catch (error) {
        toast.error('Failed to load form definition.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormDef();
  }, [formId, navigate]);

  const form = useForm({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    defaultValues: useMemo(() => {
      if (!formDef) return {};
      const defaultValues: { [key: string]: any; } = {};
      formDef.fields.forEach((field) => {
        defaultValues[field.id] = field.type === 'boolean' ? false : field.type === 'number' ? '' : '';
      });
      return defaultValues;
    }, [formDef]),
  });

  useEffect(() => {
    if (formDef) {
      form.reset(form.formState.defaultValues);
    }
  }, [formDef, form]);
  const onSubmit = async (data: z.infer<NonNullable<typeof formSchema>>) => {
    if (!user || !formDef) return;
    const payload: Partial<HaccpLog> = {
      formId: formDef.id,
      submittedBy: user.id,
      data
    };
    const promise = api('/api/haccp-logs', { method: 'POST', body: JSON.stringify(payload) });
    toast.promise(promise, {
      loading: 'Submitting log...',
      success: () => {
        navigate('/haccp');
        return 'HACCP log submitted successfully!';
      },
      error: 'Failed to submit log.'
    });
  };
  if (isLoading || !formDef || !formSchema) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-10 w-24 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto">
      <Button type="button" variant="outline" onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to HACCP Forms
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{formDef.title}</CardTitle>
              <CardDescription>{formDef.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formDef.fields.map((field) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={field.id}
                  render={({ field: formField }) => (
                    <FormItem>
                      {field.type === 'boolean' ? (
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            <Switch checked={formField.value} onCheckedChange={formField.onChange} />
                          </FormControl>
                        </div>
                      ) : (
                        <>
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            <Input type={field.type} placeholder={`Enter ${field.label.toLowerCase()}`} {...formField} value={formField.value ?? ''} />
                          </FormControl>
                        </>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Log
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}