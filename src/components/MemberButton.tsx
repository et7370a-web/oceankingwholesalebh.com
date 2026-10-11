import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemberStore } from '@/stores/memberStore';
import { startLogin, logout } from '@/lib/customerAuth';

export const MemberButton = () => {
  const { status, email, isMember } = useMemberStore();

  if (status === 'loading') return null;

  if (status === 'signedIn') {
    return (
      <Button variant="ghost" size="sm" onClick={logout} title={email ?? undefined} className="gap-1">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{isMember ? 'Member' : 'Not a member'}</span>
        <span className="text-xs text-muted-foreground">Sign out</span>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => startLogin(window.location.pathname)} className="gap-1">
      <User className="w-4 h-4" />
      Sign in
    </Button>
  );
};
