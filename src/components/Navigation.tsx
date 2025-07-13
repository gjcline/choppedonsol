import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, HelpCircle, Trophy } from 'lucide-react';
import { WalletButton } from './WalletButton';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/check', label: 'Check Wallet', icon: Search },
    { path: '/how-it-works', label: 'How It Works', icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-orbitron text-2xl font-bold holographic-text">CHOP</div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    item.disabled
                      ? 'text-gray-500 cursor-not-allowed'
                      : isActive
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.disabled && (
                    <span className="text-xs text-gray-500 ml-2">(Soon)</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Wallet Button */}
          <WalletButton />
        </div>
      </div>
    </nav>
  );
};