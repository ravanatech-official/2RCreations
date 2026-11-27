import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, MessageSquare } from 'lucide-react';
import { analytics } from '../services/analytics';
import { getWhatsAppUrl, hasWhatsApp } from '../config';

interface NavbarProps {
  onOpenContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const whatsappUrl = getWhatsAppUrl();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleStartProject = () => {
    setMobileMenuOpen(false);
    analytics.projectCtaClick('navbar');
    navigate('/contact');
  };

  const navLinks = [
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Process', path: '/process' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#D7BC97]/95 backdrop-blur-md border-b border-[#C2A57E] py-3.5 shadow-md'
          : 'bg-[#D7BC97] border-b border-[#C2A57E] py-4 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Official Brand Logo with Luxury Title */}
        <Link
          to="/"
          className="group text-left focus:outline-none flex items-center gap-3.5 py-1"
          aria-label="2R Creations - Home"
        >
          <img
            src="/assets/images/2r-black-logo.jpg"
            alt="2R Creations Emblem"
            className="h-11 sm:h-12 md:h-13 w-auto object-contain rounded-xs border border-[#1A1512]/20 shadow-xs group-hover:scale-[1.02] transition-transform duration-200"
          />
          <span 
            className="text-xl sm:text-2xl md:text-[23px] font-bold tracking-[0.14em] text-[#1A1512] group-hover:text-[#644622] transition-colors leading-none"
            style={{ fontFamily: "'Cinzel', 'Bodoni Moda', serif" }}
          >
            2R CREATIONS
          </span>
        </Link>

        {/* Desktop Navigation Links — Crisp Obsidian Espresso on Champagne Sand */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[15px] lg:text-[16px] tracking-[0.03em] font-semibold text-[#1A1512]/85">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `hover:text-[#1A1512] hover:scale-105 transition-all relative py-1.5 ${
                  isActive ? 'text-[#1A1512] font-bold' : 'text-[#1A1512]/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1A1512] rounded-full shadow-xs" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            id="nav-start-project-btn"
            onClick={handleStartProject}
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold tracking-[0.04em] text-[#FAF8F5] bg-[#1A1512] hover:bg-[#382B1E] transition-all duration-200 rounded-xs shadow-sm cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4 text-[#D7BC97] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#1A1512] hover:text-[#644622] transition-colors cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="md:hidden fixed inset-x-0 top-full bg-[#D7BC97] border-b border-[#C2A57E] shadow-2xl px-6 py-8 flex flex-col gap-6 animate-fadeIn">
          <div className="flex flex-col gap-3 text-[16px] font-semibold tracking-[0.02em] text-[#1A1512]">
            <Link
              to="/"
              className="text-left py-2.5 border-b border-[#C2A57E] hover:text-[#644622] transition-colors"
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-left py-2.5 border-b border-[#C2A57E] hover:text-[#644622] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleStartProject}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-[14px] font-semibold tracking-[0.03em] text-[#FAF8F5] bg-[#1A1512] hover:bg-[#382B1E] rounded-xs transition-colors cursor-pointer shadow-sm"
            >
              <span>Start an Album Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            {hasWhatsApp() && whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.whatsappClick('mobile_nav')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-[14px] font-semibold tracking-[0.03em] text-[#1A1512] bg-[#FAF8F5] border border-[#C2A57E] hover:bg-white rounded-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#1A1512]" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
