import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { completeLogin } from '@/lib/customerAuth';
import { useMemberStore } from '@/stores/memberStore';

const AccountCallback = () => {
  const navigate = useNavigate();
  const refresh = useMemberStore((s) => s.refresh);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    completeLogin()
      .then(async (returnTo) => {
        await refresh();
        navigate(returnTo, { replace: true });
      })
      .catch((e: Error) => setError(e.message));
  }, [navigate, refresh]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-destructive mb-4">{error}</p>
            <Link to="/" className="text-primary underline">Back to the shop</Link>
          </>
        ) : (
          <p className="text-muted-foreground">Signing you in…</p>
        )}
      </div>
    </main>
  );
};

export default AccountCallback;
