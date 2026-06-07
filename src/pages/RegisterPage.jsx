import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';
import { getErrorMessage } from '../lib/api';
import { authService } from '../services/auth.service';
import { useAuth } from '../state/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.register(form);
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-10">
      <section className="panel soft-shadow w-full max-w-md p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1e5eff] text-white">
            <ShieldCheck size={21} />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-[#172033]">Create APILens account</h1>
            <p className="text-sm text-[#66728a]">Use local auth for quick API testing.</p>
          </div>
        </div>

        {error ? <Alert>{error}</Alert> : null}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-[#536079]" htmlFor="name">Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-2 h-11 w-full rounded-md border border-[#d9e0ec] bg-white px-3 text-sm text-[#172033]"
            />
          </div>
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
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <UserPlus size={17} />
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[#66728a]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#1e5eff]">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
}
