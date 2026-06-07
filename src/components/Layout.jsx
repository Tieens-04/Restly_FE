import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, Clock, FlaskConical, Github, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../state/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/repositories', label: 'Repositories', icon: Github },
  { to: '/playground', label: 'Playground', icon: FlaskConical },
  { to: '/history', label: 'History', icon: Clock },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-[#d9e0ec] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1e5eff] text-white">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-base font-semibold text-[#172033]">APILens</p>
              <p className="text-xs text-[#66728a]">API quality workspace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-[#eaf0ff] text-[#1e5eff]'
                        : 'text-[#536079] hover:bg-[#f1f4f9] hover:text-[#172033]'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[#172033]">{user?.name || user?.email || 'Signed in'}</p>
              <p className="text-xs text-[#66728a]">{user?.providers?.github ? 'GitHub connected' : 'JWT session'}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#d9e0ec] bg-white text-[#536079] hover:bg-[#f1f4f9]"
              title="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <div className="fixed bottom-4 right-4 hidden items-center gap-2 rounded-md border border-[#d9e0ec] bg-white px-3 py-2 text-xs text-[#66728a] soft-shadow lg:flex">
        <Activity size={14} />
        Backend: localhost:5000
      </div>
    </div>
  );
}
