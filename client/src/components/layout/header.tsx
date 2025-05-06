import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import LanguageSelector from '../language-selector';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, user, logout, openLoginModal, openRegisterModal } = useAuth();
  const [location] = useLocation();

  // Handle scroll state for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`tesla-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="text-2xl font-semibold tracking-tighter">
            <span className="sky-accent">Uganda</span>VR
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <a className={`tesla-nav-link ${location === '/' ? 'text-primary font-medium' : ''}`}>
              {t('common.home')}
            </a>
          </Link>
          <Link href="/museums">
            <a className={`tesla-nav-link ${location === '/museums' ? 'text-primary font-medium' : ''}`}>
              {t('common.museums')}
            </a>
          </Link>
          <LanguageSelector />
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="tesla-nav-link flex items-center">
                {user?.name || user?.username}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/dashboard">
                    <a className="block px-4 py-2 text-sm hover:bg-muted">
                      {t('common.dashboard')}
                    </a>
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={openLoginModal}
                className="tesla-nav-link font-medium"
              >
                {t('common.login')}
              </button>
              <button
                onClick={openRegisterModal}
                className="tesla-button primary py-2 px-4 text-sm max-w-none w-auto"
              >
                {t('common.register')}
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border animate-fade-in-up">
          <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
            <Link href="/">
              <a className={`py-2 ${location === '/' ? 'text-primary font-medium' : ''}`}>
                {t('common.home')}
              </a>
            </Link>
            <Link href="/museums">
              <a className={`py-2 ${location === '/museums' ? 'text-primary font-medium' : ''}`}>
                {t('common.museums')}
              </a>
            </Link>
            <div className="py-2">
              <LanguageSelector />
            </div>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <a className="py-2">
                    {t('common.dashboard')}
                  </a>
                </Link>
                <button
                  onClick={logout}
                  className="py-2 text-left"
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={openLoginModal}
                  className="tesla-button secondary"
                >
                  {t('common.login')}
                </button>
                <button
                  onClick={openRegisterModal}
                  className="tesla-button primary"
                >
                  {t('common.register')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;