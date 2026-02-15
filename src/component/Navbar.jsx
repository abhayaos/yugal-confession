import React, { useState } from 'react';
import { Flame, CalendarDays, Clock, Sparkles, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const filterButtonClass = (filter) => `
    flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200
    ${
      activeFilter === filter
        ? 'bg-amber-900/40 text-amber-300 border border-amber-700/50 shadow-sm'
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 active:bg-zinc-700/50'
    }
  `;

  const handleProfileClick = () => {
    navigate(isLoggedIn ? '/profile' : '/auth');
  };

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        bg-gradient-to-b from-[#0F1014] to-[#1B1C24]/95
        backdrop-blur-xl border-b border-white/8
        shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left - Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <Flame 
                size={26} 
                className="text-amber-600 group-hover:text-amber-500 transition-colors" 
                strokeWidth={2.2}
              />
              <Sparkles 
                size={12} 
                className="absolute -top-1 -right-1 text-amber-400/70 animate-pulse" 
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              Confession
            </h1>
          </div>

          {/* Center - Filters (hidden on mobile, or you can make horizontal scroll if needed) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={filterButtonClass('all')}
            >
              <Flame size={16} />
              All
            </button>

            <button
              onClick={() => setActiveFilter('week')}
              className={filterButtonClass('week')}
            >
              <CalendarDays size={16} />
              This Week
            </button>

            <button
              onClick={() => setActiveFilter('today')}
              className={filterButtonClass('today')}
            >
              <Clock size={16} />
              Today
            </button>
          </div>

          {/* Right - Profile / Auth */}
          <button
            onClick={handleProfileClick}
            className="
              flex items-center gap-2.5 px-3 py-2 rounded-full
              hover:bg-zinc-800/60 transition-all duration-200
              active:scale-95
            "
          >
            {isLoggedIn ? (
              <>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                  {(user?.displayName || user?.username || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-zinc-200">
                  {user?.displayName || user?.username || 'Profile'}
                </span>
              </>
            ) : (
              <>
                <User size={20} className="text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">Sign in</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile filter bar - appears below main navbar on small screens */}
      <div className="sm:hidden border-t border-white/5 bg-black/30 backdrop-blur-lg">
        <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveFilter('all')} className={filterButtonClass('all')}>
            <Flame size={15} />
            All
          </button>
          <button onClick={() => setActiveFilter('week')} className={filterButtonClass('week')}>
            <CalendarDays size={15} />
            This Week
          </button>
          <button onClick={() => setActiveFilter('today')} className={filterButtonClass('today')}>
            <Clock size={15} />
            Today
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;