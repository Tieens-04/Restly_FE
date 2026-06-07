import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, KeyRound, ShieldCheck } from 'lucide-react';
import { API_BASE_URL, getErrorMessage } from '../lib/api';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { authService } from '../services/auth.service';
import { useAuth } from '../state/AuthContext';

export function LoginPage() {
  const googleUrl = `${API_BASE_URL}/auth/google`;
  const githubUrl = `${API_BASE_URL}/auth/github`;
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(form);
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px]">
          <section className="flex flex-col justify-center">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-[#1e5eff] text-white">
              <ShieldCheck size={25} />
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-[#172033]">
              APILens
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#536079]">
              Analyze REST API quality from GitHub repositories, detect API design smells, and turn findings into practical fixes.
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {['GitHub repositories', 'Rule engine', 'AI suggestions'].map((item) => (
                <div key={item} className="panel px-4 py-3 text-sm font-medium text-[#172033]">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="panel soft-shadow p-6">
            <h2 className="text-xl font-semibold text-[#172033]">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-[#66728a]">
              Use GitHub for the full repository workflow. Google sign-in is available for account access.
            </p>

            {error ? <div className="mt-5"><Alert>{error}</Alert></div> : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-[#536079]" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-md border border-[#d9e0ec] bg-white px-3 text-sm text-[#172033]"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#536079]" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-md border border-[#d9e0ec] bg-white px-3 text-sm text-[#172033]"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <KeyRound size={17} />
                {loading ? 'Signing in...' : 'Sign in with email'}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#d9e0ec]" />
              <span className="text-xs font-medium text-[#66728a]">or</span>
              <div className="h-px flex-1 bg-[#d9e0ec]" />
            </div>

            <div className="space-y-3">
              <a
                href={githubUrl}
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#172033] px-4 text-sm font-semibold text-white hover:bg-[#26324a]"
              >
                <Github size={18} />
                Continue with GitHub
              </a>
              <a
                href={googleUrl}
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-[#d9e0ec] bg-white px-4 text-sm font-semibold text-[#172033] hover:bg-[#f1f4f9]"
              >
                <KeyRound size={18} />
                Continue with Google
              </a>
            </div>

            <p className="mt-5 text-center text-sm text-[#66728a]">
              No account yet?{' '}
              <Link to="/register" className="font-semibold text-[#1e5eff]">
                Create one
              </Link>
            </p>

            <div className="mt-6 rounded-md bg-[#f1f4f9] p-4 text-xs leading-5 text-[#536079]">
              GitHub login stores an encrypted access token on the backend so APILens can read repositories authorized by you.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
