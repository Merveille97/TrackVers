
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import NotificationBell from '@/components/NotificationBell';
import AdminButton from '@/components/AdminButton';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, loading: authLoading } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Documentation', path: '/documentation' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center relative pt-1 group">
            <img 
              src="https://horizons-cdn.hostinger.com/eb6b8d1e-e759-4a3a-a979-e2246f01f58c/dfde3ab90e6fabc50e2f7c3bab8fe4d0.png" 
              alt="TrackVers Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-[-15px] filter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all" 
            />
            <div className="flex items-baseline">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Trac
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                k
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Vers
              </span>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                  location.pathname === link.path ? 'text-cyan-400' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Nav Links - simplified, could be a hamburger menu in future but for now fitting in */}
            <div className="flex md:hidden gap-3 mr-2">
               {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-medium transition-colors hover:text-cyan-400 ${
                    location.pathname === link.path ? 'text-cyan-400' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Admin Button only renders for admin users */}
            {!authLoading && user && user.role === 'admin' && (
              <AdminButton />
            )}

            {/* NotificationBell only renders when user is logged in */}
            {!authLoading && user && (
              <NotificationBell />
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleAuthAction}
              className="hover:bg-white/10 transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-white" />
            </Button>
            
            {!authLoading && user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="hover:bg-white/10 transition-colors"
                aria-label="Log Out"
              >
                <LogOut className="w-5 h-5 text-red-400" />
              </Button>
            ) : (
              !authLoading && location.pathname !== '/login' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/login')}
                  className="hover:bg-white/10 transition-colors"
                  aria-label="Log In"
                >
                  <LogIn className="w-5 h-5 text-green-400" />
                </Button>
              )
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
