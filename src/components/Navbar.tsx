import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ScrollText, LayoutDashboard, Library, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useAuth();

  const linkClass = (path: string) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
      pathname === path
        ? 'bg-amber-100 text-amber-800'
        : 'text-stone-300 hover:text-white hover:bg-stone-700'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-900 border-b border-stone-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 text-white hover:text-amber-300 transition-colors">
            <ScrollText className="w-5 h-5 text-amber-400" />
            <span className="font-semibold tracking-wide text-sm">
              Sri Lankan Inscriptions
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link to="/" className={linkClass('/')}>
              <Library className="w-4 h-4" />
              <span>Archive</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/admin" className={linkClass('/admin')}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-stone-700">
                  <span className="text-stone-400 text-xs hidden sm:block">{username}</span>
                  <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/admin/login" className={linkClass('/admin/login')}>
                <LogIn className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
