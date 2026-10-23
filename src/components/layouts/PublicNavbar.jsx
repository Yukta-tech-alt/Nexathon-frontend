import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { Navigation, Sun, Moon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function PublicNavbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useRouteWise();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Features', path: '/#features' },
    { label: 'About', path: '/about' },
    { label: 'Help', path: '/help' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Navigation className="w-5 h-5 fill-slate-950 rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              RouteWise <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-slate-400 -mt-1">
              Traffic & Commute Intelligence
            </span>
          </div>
        </Link>

        {/* Public Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          <Link
            to="/login"
            className="hidden sm:inline-block px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            Login
          </Link>

          <Link
            to="/select-role"
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
