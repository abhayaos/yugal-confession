import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, PlusCircle, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // Shared class for nav items
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-[#875124]/20 text-[#875124]' 
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  const handleProfileClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-[#1B1C24] border-r border-white/10 flex-col z-30 transition-all duration-300`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">Confession</h1>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          {/* Home Link */}
          <NavLink to="/" className={linkClass}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          {/* Messages Link */}
          <NavLink to="/messages" className={linkClass}>
            <MessageCircle size={20} />
            <span>Whisper</span>
          </NavLink>

          {/* Create Confession Button */}
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 mb-4 ${
                isActive 
                  ? 'bg-[#875124]/20 text-[#875124]' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <PlusCircle size={20} />
            <span>Create</span>
          </NavLink>

          {/* Profile/Auth Link */}
          <NavLink
            to={isLoggedIn ? "/profile" : "/auth"}
            onClick={handleProfileClick}
            className={linkClass}
          >
            <User size={20} />
            <span>{isLoggedIn ? 'Profile' : 'Auth'}</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      ></div>

      <aside 
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-[#1B1C24] border-r border-white/10 flex-col z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h1 className="text-lg font-bold text-white">Confession</h1>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-white/10 text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          {/* Home Link */}
          <NavLink to="/" className={linkClass} onClick={toggleSidebar}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          {/* Messages Link */}
          <NavLink to="/messages" className={linkClass} onClick={toggleSidebar}>
            <MessageCircle size={20} />
            <span>Whisper</span>
          </NavLink>

          {/* Create Confession Button */}
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 mb-4 ${
                isActive 
                  ? 'bg-[#875124]/20 text-[#875124]' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
            onClick={toggleSidebar}
          >
            <PlusCircle size={20} />
            <span>Create</span>
          </NavLink>

          {/* Profile/Auth Link */}
          <NavLink
            to={isLoggedIn ? "/profile" : "/auth"}
            onClick={(e) => {
              handleProfileClick(e);
              toggleSidebar();
            }}
            className={linkClass}
          >
            <User size={20} />
            <span>{isLoggedIn ? 'Profile' : 'Auth'}</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#1B1C24] border border-white/10 text-white shadow-lg"
        >
          <Menu size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;