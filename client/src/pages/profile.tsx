import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, getQueryFn } from '@/lib/queryClient';
import { User } from '@shared/schema';
import ProfileImageUpload from '@/components/profile/profile-image-upload';
import ChangePasswordButton from '@/components/profile/change-password-button';
import LogoutButton from '@/components/profile/logout-button';
import LanguageSelector from '@/components/profile/language-selector';
import { useTranslations } from '@/hooks/use-translations';

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslations();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Partial<User>>({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      position: user?.position || '',
    }
  });
  
  // Update form when user data is loaded
  React.useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName);
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
      setValue('position', user.position || '');
    }
  }, [user, setValue]);
  
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<User>) => apiRequest('PATCH', '/api/user', data),
    onSuccess: () => {
      toast({
        title: 'Профіль оновлено',
        description: 'Ваші особисті дані успішно оновлено',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error) => {
      toast({
        title: 'Помилка',
        description: `Не вдалось оновити профіль: ${error}`,
        variant: 'destructive',
      });
    }
  });
  
  const onSubmit = (data: Partial<User>) => {
    updateProfileMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <div className="px-4 py-6 pb-16 flex justify-center items-center min-h-[60vh]">
        <p>{t.loading}</p>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <ProfileImageUpload user={user || null} />
        <h2 className="text-xl font-medium mt-4">{user?.fullName || 'Користувач'}</h2>
        <p className="text-muted-foreground">{user?.position || 'Співробітник'}</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Data */}
        <Card className="bg-card rounded-lg shadow-lg p-4 mb-4">
          <CardContent className="p-0">
            <h3 className="text-lg font-medium mb-4">{t.profile.title}</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-muted-foreground text-sm mb-1">{t.profile.fullName}</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  className="w-full bg-background border-input" 
                  {...register('fullName')}
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-muted-foreground text-sm mb-1">{t.profile.email}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  className="w-full bg-background border-input" 
                  {...register('email')}
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-muted-foreground text-sm mb-1">{t.profile.phone}</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  className="w-full bg-background border-input" 
                  {...register('phone')}
                />
              </div>
              
              <div>
                <Label htmlFor="position" className="text-muted-foreground text-sm mb-1">{t.profile.position}</Label>
                <Input 
                  id="position" 
                  type="text" 
                  className="w-full bg-background border-input" 
                  {...register('position')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-dark text-white font-medium mb-4"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? t.loading : t.profile.update}
        </Button>
        
        {/* Language Selection */}
        <LanguageSelector />
        
        {/* Account Actions */}
        <Card className="bg-card rounded-lg shadow-lg p-4 mb-4">
          <CardContent className="p-0">
            <h3 className="text-lg font-medium mb-4">{t.nav.login}</h3>
            
            <div className="space-y-4">
              <ChangePasswordButton />
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
