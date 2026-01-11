import React, { useState } from 'react'
import { Flame, CalendarDays, Clock, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [active, setActive] = useState('all')
  const navigate = useNavigate()
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const btnClass = (name) =>
    `flex items-center gap-1 text-sm px-2 py-1 transition
     ${active === name
       ? 'text-[#875124] border-b-2 border-[#875124]'
       : 'text-white/60 hover:text-white'}`

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile')
    } else {
      navigate('/auth')
    }
  }

  return (
    <nav className="w-full px-6 py-3 flex flex-col items-start bg-[#1B1C24] border-b border-white/10 fixed top-0 left-0 z-40">

      {/* Title */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Flame size={22} className="text-[#875124]" />
          <h2 className="text-white text-lg font-semibold tracking-wide">
            Feed
          </h2>
        </div>
        
        <button 
          onClick={handleProfileClick}
          className="flex items-center gap-2 text-white/60 hover:text-white transition"
        >
          <User size={20} />
          <span className="text-sm">
            {isLoggedIn ? (user.username || 'Profile') : 'Login'}
          </span>
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-5 mt-3">
        <button onClick={() => setActive('all')} className={btnClass('all')}>
          <Flame size={14} />
          All
        </button>

        <button onClick={() => setActive('week')} className={btnClass('week')}>
          <CalendarDays size={14} />
          This Week
        </button>

        <button onClick={() => setActive('today')} className={btnClass('today')}>
          <Clock size={14} />
          Today
        </button>
      </div>

    </nav>
  )
}

export default Navbar
