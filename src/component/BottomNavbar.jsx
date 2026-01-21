import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, PlusCircle, User } from 'lucide-react';

const BottomNavbar = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // Shared class for nav items
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all duration-200
     ${isActive ? 'text-[#875124]' : 'text-white/60 hover:text-white'}`;

  const handleProfileClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-[#1B1C24]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around z-50 px-2 safe-area-padding-bottom">
      
      {/* Home Link */}
      <NavLink to="/" className={linkClass}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>

      {/* Create Confession Button */}
      <NavLink
        to="/create"
        className="relative -mt-8 flex items-center justify-center z-10"
      >
        <div className="bg-[#875124] p-4 rounded-full shadow-lg shadow-[#875124]/30 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[#a36d48] active:scale-95">
          <PlusCircle size={26} className="text-white" />
        </div>
      </NavLink>

      {/* Whisper Link */}
      <NavLink to="/messages" className={linkClass}>
        <MessageCircle size={24} />
        <span>Whisper</span>
      </NavLink>

      {/* Profile/Auth Link */}
      <NavLink
        to={isLoggedIn ? "/profile" : "/auth"}
        onClick={handleProfileClick}
        className={linkClass}
      >
        <User size={24} />
        <span>{isLoggedIn ? 'Profile' : 'Auth'}</span>
      </NavLink>

    </nav>
  );
};

export default BottomNavbar;
