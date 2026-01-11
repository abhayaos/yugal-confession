import React, { useEffect } from 'react'
import Feed from '../component/Feed'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.id) {
      navigate('/auth');
    } else if (!user.isOnboarded) {
      navigate('/onboarding');
    }
  }, [navigate]);
  
  return (
    <Feed />
  )
}

export default Home