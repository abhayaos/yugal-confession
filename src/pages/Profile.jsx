import React, { useState, useEffect } from 'react';
import { Settings, Edit3, Award, Star, LogOut, Users, Heart, MessageSquare } from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/auth';
      return;
    }

    setUser(userData);

    const fetchData = async () => {
      try {
        const tokenHeader = { Authorization: `Bearer ${token}` };

        const [statsRes, confessionsRes] = await Promise.all([
          fetch(`https://backend-confession.vercel.app/api/profile/${userData.id}/stats`, { headers: tokenHeader }),
          fetch(`https://backend-confession.vercel.app/api/profile/${userData.id}/confessions`, { headers: tokenHeader }),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats || {});
        }

        if (confessionsRes.ok) {
          const data = await confessionsRes.json();
          setConfessions(data.confessions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'just now';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white pb-24">
        <div className="max-w-2xl mx-auto px-5 pt-10">
          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-10">
            <div className="h-9 w-28 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-10 w-10 bg-zinc-800 rounded-full animate-pulse" />
          </div>

          {/* Avatar + name skeleton */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-32 h-32 rounded-full bg-zinc-800 animate-pulse mb-5" />
            <div className="h-7 w-48 bg-zinc-800 rounded animate-pulse mb-3" />
            <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse mb-6" />
            <div className="h-10 w-72 bg-zinc-800/60 rounded-full animate-pulse" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-12 mx-auto bg-zinc-800 rounded mb-2 animate-pulse" />
                <div className="h-4 w-20 mx-auto bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Recent posts skeleton */}
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-900/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const initial = (user?.displayName || user?.username || 'A')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white pb-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <button className="p-3 rounded-full bg-zinc-900/60 hover:bg-zinc-800/80 transition backdrop-blur-sm">
            <Settings size={22} />
          </button>
        </div>

        {/* Hero / Profile main section */}
        <div className="relative flex flex-col items-center mb-16">
          {/* Avatar with subtle ring */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 flex items-center justify-center text-5xl font-bold shadow-2xl shadow-amber-900/30 ring-2 ring-amber-500/40">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-amber-700 hover:bg-amber-600 p-2.5 rounded-full shadow-lg transition">
              <Edit3 size={18} />
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-2 tracking-tight">
            {user?.displayName || 'Anonymous Soul'}
          </h2>

          <p className="text-zinc-400 mb-6 text-sm">{user?.email || '—'}</p>

          {/* Interests / mood tags - soft pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-8 max-w-md">
            {['Coding', 'Music', 'Movies', 'Travel', 'Coffee', 'Midnight thoughts'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-full text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mb-10">
            <button className="px-7 py-3 bg-gradient-to-r from-amber-700 to-amber-600 rounded-full font-medium shadow-lg shadow-amber-900/30 hover:shadow-xl hover:shadow-amber-900/40 transition-all duration-300">
              Invite Friends
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth';
              }}
              className="px-7 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 rounded-full font-medium transition-all duration-300 flex items-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Quick stats - floating style */}
          <div className="grid grid-cols-4 gap-6 w-full max-w-sm text-center">
            <div>
              <div className="text-2xl font-bold text-amber-400">{stats?.confessionCount || 0}</div>
              <div className="text-xs text-zinc-500 mt-1">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-400">{stats?.likeCount || 0}</div>
              <div className="text-xs text-zinc-500 mt-1">Likes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats?.commentCount || 0}</div>
              <div className="text-xs text-zinc-500 mt-1">Comments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{stats?.followerCount || 0}</div>
              <div className="text-xs text-zinc-500 mt-1">Followers</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <MessageSquare size={20} className="text-amber-500" />
              Recent Confessions
            </h3>

            <div className="space-y-5">
              {confessions.length > 0 ? (
                confessions.slice(0, 5).map((c) => (
                  <div
                    key={c._id}
                    className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-5 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-200"
                  >
                    <p className="text-zinc-200 leading-relaxed mb-3">
                      {c.content}
                    </p>
                    <div className="text-xs text-zinc-500">
                      {formatTimeAgo(c.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-zinc-600">
                  You haven't shared any thoughts yet...
                </div>
              )}
            </div>
          </div>

          {/* Badges section - minimal */}
          <div>
            <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Award size={20} className="text-yellow-500" />
              Highlights & Badges
            </h3>

            <div className="flex flex-wrap gap-3">
              {['First Spark', 'Consistent Soul', 'Star Performer', 'Night Owl', 'Deep Thinker'].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 border border-zinc-800/70 rounded-full text-sm"
                >
                  <Star size={16} className="text-amber-400" />
                  <span className="text-zinc-300">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;