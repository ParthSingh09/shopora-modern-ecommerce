import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount, toggleDrawer } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and search on route change
  const [lastPathname, setLastPathname] = useState(location.pathname);
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'All Drops', path: '/shop' },
    { label: 'Retro Highs', path: '/shop?category=retro-high' },
    { label: 'Collabs', path: '/shop?category=collabs' },
    { label: 'Low Runners', path: '/shop?category=low-runners' },
    { label: 'Lookbook', path: '/lookbook' },
  ];

  return (
    <>
      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-shopora-accent text-black font-bold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          isScrolled
            ? 'bg-[#0B0C0E]/95 backdrop-blur-md border-b border-shopora-border py-3 shadow-card'
            : 'bg-[#0B0C0E]/90 backdrop-blur-sm border-b border-shopora-border/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-shopora-accent rounded-lg"
                aria-label="Shopora Home"
              >
                <div className="w-8 h-8 rounded-lg bg-shopora-accent flex items-center justify-center font-display font-black text-black text-lg transition-transform group-hover:scale-105">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-xl tracking-tight text-white uppercase group-hover:text-shopora-accent transition-colors leading-none">
                    SHOPORA<span className="text-shopora-accent font-mono text-xs ml-0.5">®</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-shopora-muted font-mono mt-0.5">
                    Sneaker Archive
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname + location.search === link.path;
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'text-shopora-accent bg-shopora-accent/10 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2.5">
              {/* Desktop Search Bar */}
              <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center" role="search">
                <input
                  type="search"
                  placeholder="Search drops, models, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search sneaker collection"
                  className="w-48 lg:w-60 pl-8 pr-3 py-2 bg-shopora-surface border border-shopora-border rounded-xl text-xs text-white placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent focus:w-72 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-shopora-muted absolute left-2.5 pointer-events-none" />
              </form>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="sm:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
                aria-label="Open search bar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                id="navbar-cart-button"
                onClick={toggleDrawer}
                className="relative p-2.5 rounded-xl bg-shopora-surface border border-shopora-border hover:border-shopora-borderLight text-slate-100 hover:text-shopora-accent transition-all flex items-center gap-2"
                aria-label={`Open shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline-block text-xs font-mono font-semibold tracking-wider">
                  BAG
                </span>
                {itemCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full bg-shopora-accent text-black font-mono font-black text-[11px] leading-none">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Expansion */}
          {searchOpen && (
            <form onSubmit={handleSearchSubmit} className="sm:hidden mt-3 relative" role="search">
              <input
                type="search"
                placeholder="Search sneakers, Jordan, Yeezy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-9 py-2 bg-shopora-surface border border-shopora-accent rounded-xl text-xs text-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-shopora-accent absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-2.5 text-shopora-muted"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-shopora-border space-y-1 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-shopora-accent hover:bg-white/5 transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-shopora-muted" />
                </Link>
              ))}
              <div className="pt-2 border-t border-shopora-border/60">
                <Link
                  to="/cart"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-shopora-surface border border-shopora-border text-shopora-accent text-xs font-bold uppercase tracking-wider"
                >
                  <span>View Full Bag</span>
                  <span className="font-mono">{itemCount} items</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
