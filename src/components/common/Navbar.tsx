import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Flame, Shield, ArrowRight } from 'lucide-react';
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

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'All Drops', path: '/shop' },
    { label: 'Grails', path: '/shop?category=retro-high' },
    { label: 'Collabs', path: '/shop?category=collabs' },
    { label: 'Low Runners', path: '/shop?category=low-runners' },
    { label: 'Lookbook', path: '/lookbook' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0B0E]/95 backdrop-blur-md border-b border-shopora-border/80 shadow-2xl py-3.5'
          : 'bg-[#0A0B0E]/80 backdrop-blur-sm border-b border-shopora-border/40 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group focus:outline-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#CCFF00] to-[#99CC00] flex items-center justify-center shadow-glow-accent group-hover:scale-105 transition-transform">
                <span className="font-display font-black text-black text-xl leading-none tracking-tighter">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter text-white uppercase group-hover:text-shopora-accent transition-colors">
                  SHOPORA<span className="text-shopora-accent font-mono text-sm ml-0.5">®</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-shopora-muted -mt-1 font-mono">
                  Street Culture &amp; Vault
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname + location.search === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-shopora-accent bg-shopora-accent/10 font-semibold'
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
          <div className="flex items-center gap-3">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
              <input
                type="text"
                placeholder="Search grails, Travis, Dunks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-9 pr-3 py-2 bg-shopora-card/90 border border-shopora-border rounded-xl text-xs text-slate-100 placeholder:text-shopora-muted focus:outline-none focus:border-shopora-accent/80 focus:w-72 transition-all"
              />
              <Search className="w-4 h-4 text-shopora-muted absolute left-3 pointer-events-none" />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Authenticity Guarantee Link */}
            <Link
              to="/lookbook"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-shopora-border/60 bg-shopora-card text-xs text-slate-300 hover:text-shopora-accent hover:border-shopora-accent/40 transition-colors"
              title="Learn about Shopora multi-point authentication"
            >
              <Shield className="w-3.5 h-3.5 text-shopora-accent" />
              <span>Vault Certified</span>
            </Link>

            {/* Cart Button */}
            <button
              id="navbar-cart-button"
              onClick={toggleDrawer}
              className="relative p-2.5 rounded-xl bg-shopora-card border border-shopora-border hover:border-shopora-accent/50 text-slate-100 hover:text-shopora-accent transition-all group flex items-center gap-2"
              aria-label={`Open shopping bag with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline-block text-xs font-semibold tracking-wider font-mono">
                BAG
              </span>
              {itemCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 min-w-[20px] h-5 rounded-full bg-shopora-accent text-black font-mono font-bold text-xs shadow-glow-accent animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="sm:hidden mt-3 relative">
            <input
              type="text"
              placeholder="Search sneakers, Jordan, Yeezy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 bg-shopora-card border border-shopora-accent/60 rounded-xl text-sm text-slate-100 focus:outline-none"
            />
            <Search className="w-4 h-4 text-shopora-accent absolute left-3 top-3.5" />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-3 text-shopora-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-shopora-border space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:text-shopora-accent hover:bg-white/5 transition-colors"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-shopora-muted" />
              </Link>
            ))}
            <div className="pt-2 border-t border-shopora-border/60">
              <Link
                to="/cart"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-shopora-accent/10 border border-shopora-accent/30 text-shopora-accent font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  View Bag &amp; Checkout
                </span>
                <span className="font-mono">{itemCount} items</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
