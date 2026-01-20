import React, { useState, useEffect } from 'react';
import { Settings, Edit3, Award, Star } from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get user info from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to auth if not logged in
      window.location.href = '/auth';
      return;
    }
    
    // Set the user data from localStorage
    setUser(userData);
    
    // Fetch user stats from backend
    const fetchStats = async () => {
      try {
        const response = await fetch(`https://backend-confession.vercel.app/api/profile/${userData.id}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        } else {
          console.error('Failed to fetch stats');
        }
        
        // Fetch user's confessions for activity timeline
        const confessionsResponse = await fetch(`https://backend-confession.vercel.app/api/profile/${userData.id}/confessions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (confessionsResponse.ok) {
          const confessionsData = await confessionsResponse.json();
          setConfessions(confessionsData.confessions);
        } else {
          console.error('Failed to fetch confessions');
        }
      } catch (error) {
        console.error('Error fetching stats and confessions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
    
  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
      
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
    
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-6 sm:px-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button className="p-3 rounded-full hover:bg-zinc-800 transition">
          <Settings size={24} className="text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8">
        <div className="bg-[#1B1C24] rounded-2xl p-6 border border-white/10 shadow-md flex flex-col items-center">
          {/* Profile Picture + Edit */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl font-bold text-white">
                {user.profilePicture || (user.displayName ? user.displayName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase())}
              </div>
              <button className="absolute bottom-0 right-0 bg-[#875124] rounded-full p-2 shadow-lg">
                <Edit3 size={20} className="text-white" />
              </button>
            </div>

            {/* Name & Email */}
            <h2 className="text-2xl font-bold mt-4">{user.displayName || 'Anonymous Soul'}</h2>
            <p className="text-white/70 mb-4">{user.email}</p>

            {/* Tags */}
            <div className="flex justify-center gap-3 mb-6 flex-wrap">
              <span className="px-4 py-2 bg-[#0F1014] rounded-full text-xs text-white/80">💻 Coding</span>
              <span className="px-4 py-2 bg-[#0F1014] rounded-full text-xs text-white/80">🎵 Music</span>
              <span className="px-4 py-2 bg-[#0F1014] rounded-full text-xs text-white/80">🎬 Movies</span>
              <span className="px-4 py-2 bg-[#0F1014] rounded-full text-xs text-white/80">🏔 Travel</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#0F1014] rounded-full h-4 mb-6">
              <div className="bg-[#875124] h-4 rounded-full w-3/5"></div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-[#875124] rounded-xl font-semibold hover:bg-[#a36d48] transition">
                Invite Friends
              </button>
              <button 
                onClick={() => {
                  // Clear user data from localStorage
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  
                  // Redirect to auth
                  window.location.href = '/auth';
                }}
                className="px-6 py-3 bg-[#0F1014] border border-white/10 rounded-xl font-semibold hover:bg-zinc-800 transition"
              >
                Sign Out
              </button>

            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#1B1C24] rounded-2xl p-6 border border-white/10 shadow-md">
          <h3 className="text-xl font-bold mb-4">Achievements & Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-[#0F1014] rounded-xl">
              <Award size={20} className="text-yellow-400" />
              <span className="text-sm text-white/80">First Spark</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-[#0F1014] rounded-xl">
              <Award size={20} className="text-yellow-400" />
              <span className="text-sm text-white/80">Consistent Soul</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-[#0F1014] rounded-xl">
              <Star size={20} className="text-indigo-400" />
              <span className="text-sm text-white/80">Star Performer</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-[#0F1014] rounded-xl">
              <Award size={20} className="text-yellow-400" />
              <span className="text-sm text-white/80">Monthly Master</span>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-[#1B1C24] rounded-2xl p-6 border border-white/10 shadow-md">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {confessions.length > 0 ? (
              confessions.slice(0, 5).map((confession, index) => (
                <li key={confession._id || index} className="flex justify-between items-center bg-[#0F1014] p-3 rounded-lg">
                  <span className="flex-1 mr-2">{confession.content.substring(0, 40)}{confession.content.length > 40 ? '...' : ''}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 mr-2">{formatTimeAgo(confession.createdAt)}</span>
                    
                  </div>
                </li>
              ))
            ) : (
              <li className="flex justify-center items-center bg-[#0F1014] p-3 rounded-lg">
                <span>No recent activity</span>
              </li>
            )}
          </ul>
        </div>

        {/* Stats */}
        <div className="bg-[#1B1C24] rounded-2xl p-6 border border-white/10 shadow-md grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {stats ? (
            <>
              <div>
                <h4 className="text-lg font-bold">{stats.confessionCount || 0}</h4>
                <p className="text-white/70 text-sm">Posts</p>
              </div>
              <div>
                <h4 className="text-lg font-bold">{stats.likeCount || 0}</h4>
                <p className="text-white/70 text-sm">Likes</p>
              </div>
              <div>
                <h4 className="text-lg font-bold">{stats.commentCount || 0}</h4>
                <p className="text-white/70 text-sm">Comments</p>
              </div>
              <div>
                <h4 className="text-lg font-bold">{stats.followerCount || 0}</h4>
                <p className="text-white/70 text-sm">Followers</p>
              </div>
            </>
          ) : (
            <div className="flex justify-center col-span-4 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
<div className="h-12"></div>


    </div>
  );
}

export default Profile;
