import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = params.get('token');

    if (token) {
      setToken(token);
      navigate('/repositories', { replace: true });
      return;
    }

    navigate('/login', { replace: true });
  }, [navigate, params, setToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] text-sm text-[#536079]">
      Completing sign-in...
    </div>
  );
}
