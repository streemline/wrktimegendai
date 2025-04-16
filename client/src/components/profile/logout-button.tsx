import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from '@/hooks/use-translations';

export default function LogoutButton() {
  const { toast } = useToast();
  const { logoutMutation } = useAuth();
  const { t } = useTranslations();
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: t.nav.logoutSuccess,
          description: t.nav.logoutSuccessMessage,
        });
      },
      onError: (error) => {
        toast({
          title: t.auth.error,
          description: `${t.nav.logoutError}: ${error}`,
          variant: 'destructive',
        });
      }
    });
  };
  
  return (
    <Button 
      type="button"
      variant="outline"
      className="flex items-center gap-2 w-full justify-center border-destructive text-destructive" 
      onClick={handleLogout}
    >
      <LogOut size={16} />
      <span>{t.nav.logout}</span>
    </Button>
  );
}