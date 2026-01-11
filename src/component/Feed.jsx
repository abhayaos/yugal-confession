import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Flame, Clock, Send, RotateCcw } from 'lucide-react';

function Feed() {
  const [confessions, setConfessions] = useState([]);
  const [likedConfessions, setLikedConfessions] = useState(() => {
    // Initialize liked confessions from localStorage
    const savedLikedConfessions = localStorage.getItem('likedConfessions');
    return savedLikedConfessions ? new Set(JSON.parse(savedLikedConfessions)) : new Set();
  });
  const [loading, setLoading] = useState(false);

  // Fetch confessions from backend
  const fetchConfessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch both regular feed and trending confessions
      const [feedResponse, trendingResponse] = await Promise.all([
        fetch('http://localhost:5000/api/feed', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5000/api/feed/trending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
      
      if (feedResponse.ok && trendingResponse.ok) {
        const feedData = await feedResponse.json();
        const trendingData = await trendingResponse.json();
        
        // Transform feed confessions
        const feedConfessions = feedData.confessions.map(confession => ({
          id: confession._id,
          content: confession.content,
          timestamp: formatTimeAgo(confession.createdAt),
          likes: confession.likes.length,
          comments: confession.comments.length,
          shares: confession.shares || 0,
          author: confession.author,
          isTrending: false
        }));
        
        // Transform trending confessions
        const trendingConfessions = trendingData.confessions.map(confession => ({
          id: confession._id,
          content: confession.content,
          timestamp: formatTimeAgo(confession.createdAt),
          likes: confession.likes.length,
          comments: confession.comments.length,
          shares: confession.shares || 0,
          author: confession.author,
          isTrending: true
        }));
        
        // Show trending posts when there are 3 or more posts in the feed
        let finalConfessions = [];
        if (feedConfessions.length >= 3) {
          // Combine trending and recent posts
          finalConfessions = [...trendingConfessions, ...feedConfessions];
        } else {
          // Show all posts as recent if less than 3
          finalConfessions = feedConfessions;
        }
        
        // Update confessions with preserved liked state
        const updatedConfessions = finalConfessions.map(conf => ({
          ...conf,
          isLiked: likedConfessions.has(conf.id)
        }));
        
        setConfessions(updatedConfessions);
      } else {
        console.error('Failed to fetch confessions');
      }
    } catch (error) {
      console.error('Error fetching confessions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchConfessions();
  }, []);



  // Handle like action
  const handleLike = async (confessionId) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`http://localhost:5000/api/feed/${confessionId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        setConfessions(prevConfessions => 
          prevConfessions.map(conf => {
            if (conf.id === confessionId) {
              return {
                ...conf,
                likes: data.liked ? conf.likes + 1 : conf.likes - 1
              };
            }
            return conf;
          })
        );
        
        // Update liked confessions set
        const newLikedConfessions = new Set(likedConfessions);
        if (data.liked) {
          newLikedConfessions.add(confessionId);
        } else {
          newLikedConfessions.delete(confessionId);
        }
        setLikedConfessions(newLikedConfessions);
        
        // Save to localStorage to persist across reloads
        localStorage.setItem('likedConfessions', JSON.stringify(Array.from(newLikedConfessions)));
      }
    } catch (error) {
      console.error('Error liking confession:', error);
    }
  };

  // Handle comment action
  const handleComment = (confessionId) => {
    // For now, just navigate to the confession detail page
    // In a real app, you might open a comment modal
    console.log('Comment on confession:', confessionId);
  };

  // Handle share action
  const handleShare = (confessionId) => {
    // For now, just log the share action
    // In a real app, you might show share options
    console.log('Share confession:', confessionId);
  };

  const handleRefresh = () => {
    fetchConfessions();
  };
  
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
  

  
  return (
    <div className="feed-container mt-6 w-full py-6 pb-24 bg-[#0F1014] min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Feed</h1>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-full hover:bg-[#1B1C24] transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh feed"
          >
            <RotateCcw size={24} className={`${loading ? 'animate-spin' : ''}`} color="white" />
          </button>
        </div>
        {/* Show trending section only if there are 3 or more confessions */}
        {confessions.length >= 3 && (
          <>
            {/* Trending Section */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Flame size={20} className="text-[#875124]" />
                Trending Confessions
              </h2>
              <div className="space-y-4">
                {loading ? (
                  // Skeleton loading for trending posts
                  Array.from({ length: 2 }).map((_, index) => (
                    <div 
                      key={`skeleton-trending-${index}`}
                      className="bg-[#1B1C24] rounded-xl p-4 border border-white/10 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-700 w-10 h-10 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-700 rounded w-full animate-pulse"></div>
                            <div className="h-3 bg-gray-700 rounded w-11/12 animate-pulse"></div>
                            <div className="h-3 bg-gray-700 rounded w-8/12 animate-pulse"></div>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  confessions.filter(c => c.isTrending).slice(0, 2).map((confession) => (
                    <div 
                      key={`trending-${confession.id}`}
                      className="bg-[#1B1C24] rounded-xl p-4 border border-white/10 shadow-sm relative"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                          {confession.author && confession.author.profilePicture && confession.author.profilePicture.length <= 4 ? confession.author.profilePicture : (confession.author && confession.author.displayName ? confession.author.displayName.charAt(0).toUpperCase() : (confession.author && confession.author.username ? confession.author.username.charAt(0).toUpperCase() : 'A'))}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">
                              {confession.author && confession.author.displayName ? confession.author.displayName : (confession.author && confession.author.username ? confession.author.username : 'Anonymous')}
                            </span>
                          </div>
                          <div className="text-white/80 text-sm mb-3">
                            {confession.content}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            <button 
                              className={`flex items-center gap-1 hover:text-[#875124] transition ${confession.isLiked ? 'text-red-500' : 'text-white/50'}`}
                              onClick={() => handleLike(confession.id)}
                            >
                              <Heart size={20} fill={confession.isLiked ? 'currentColor' : 'none'} />
                              <span>{confession.likes}</span>
                            </button>
                            
                            <button 
                              className="flex items-center gap-1 hover:text-[#875124] transition"
                              onClick={() => handleComment(confession.id)}
                            >
                              <MessageCircle size={20} />
                              <span>{confession.comments}</span>
                            </button>
                            
                            <button 
                              className="flex items-center gap-1 hover:text-[#875124] transition"
                              onClick={() => handleShare(confession.id)}
                            >
                              <Share size={20} />
                              <span>{confession.shares}</span>
                            </button>
                            
                            <div className="flex items-center gap-1 text-xs text-white/50">
                              <Clock size={14} />
                              <span>{confession.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!confession.author || confession.author.id !== JSON.parse(localStorage.getItem('user'))?.id ? (
                        <button className="absolute top-4 right-4 text-white/50 hover:text-[#875124] transition">
                          <Send size={16} />
                        </button>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </section>
            
            {/* Recent Section - showing non-trending posts */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-[#875124]" />
                Recent Confessions
              </h2>
              <div className="space-y-4">
                {loading ? (
                  // Skeleton loading for recent posts
                  Array.from({ length: 3 }).map((_, index) => (
                    <div 
                      key={`skeleton-recent-${index}`}
                      className="bg-[#1B1C24] rounded-xl p-4 border border-white/10 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-700 w-10 h-10 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-700 rounded w-full animate-pulse"></div>
                            <div className="h-3 bg-gray-700 rounded w-11/12 animate-pulse"></div>
                            <div className="h-3 bg-gray-700 rounded w-8/12 animate-pulse"></div>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  confessions.filter(c => !c.isTrending).map((confession) => (
                    <div 
                      key={`recent-${confession.id}`}
                      className="bg-[#1B1C24] rounded-xl p-4 border border-white/10 shadow-sm relative"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-teal-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                          {confession.author && confession.author.profilePicture && confession.author.profilePicture.length <= 4 ? confession.author.profilePicture : (confession.author && confession.author.displayName ? confession.author.displayName.charAt(0).toUpperCase() : (confession.author && confession.author.username ? confession.author.username.charAt(0).toUpperCase() : 'U'))}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">
                              {confession.author && confession.author.displayName ? confession.author.displayName : (confession.author && confession.author.username ? confession.author.username : 'User')}
                            </span>
                          </div>
                          <div className="text-white/80 text-sm mb-3">
                            {confession.content}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            <button 
                              className={`flex items-center gap-1 hover:text-[#875124] transition ${confession.isLiked ? 'text-red-500' : 'text-white/50'}`}
                              onClick={() => handleLike(confession.id)}
                            >
                              <Heart size={20} fill={confession.isLiked ? 'currentColor' : 'none'} />
                              <span>{confession.likes}</span>
                            </button>
                            
                            <button 
                              className="flex items-center gap-1 hover:text-[#875124] transition"
                              onClick={() => handleComment(confession.id)}
                            >
                              <MessageCircle size={20} />
                              <span>{confession.comments}</span>
                            </button>
                            
                            <button 
                              className="flex items-center gap-1 hover:text-[#875124] transition"
                              onClick={() => handleShare(confession.id)}
                            >
                              <Share size={20} />
                              <span>{confession.shares}</span>
                            </button>
                            
                            <div className="flex items-center gap-1 text-xs text-white/50">
                              <Clock size={14} />
                              <span>{confession.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!confession.author || confession.author.id !== JSON.parse(localStorage.getItem('user'))?.id ? (
                        <button className="absolute top-4 right-4 text-white/50 hover:text-[#875124] transition">
                          <Send size={16} />
                        </button>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
        
        {/* Show all posts as recent if less than 3 */}
        {confessions.length < 3 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-[#875124]" />
              Recent Confessions
            </h2>
            <div className="space-y-4">
              {loading ? (
                // Skeleton loading for recent posts when less than 3
                Array.from({ length: 3 }).map((_, index) => (
                  <div 
                    key={`skeleton-recent-${index}`}
                    className="bg-[#1B1C24] rounded-xl p-4 border border-white/10 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-700 w-10 h-10 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-700 rounded w-full animate-pulse"></div>
                          <div className="h-3 bg-gray-700 rounded w-11/12 animate-pulse"></div>
                          <div className="h-3 bg-gray-700 rounded w-8/12 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                confessions.map((confession) => (
                  <div 
                    key={`recent-${confession.id}`}
                    className="bg-[#1B1C24] rounded-xl p-4 border border-white/10 shadow-sm relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-br from-blue-500 to-teal-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                        {confession.author && confession.author.profilePicture && confession.author.profilePicture.length <= 4 ? confession.author.profilePicture : (confession.author && confession.author.displayName ? confession.author.displayName.charAt(0).toUpperCase() : (confession.author && confession.author.username ? confession.author.username.charAt(0).toUpperCase() : 'U'))}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-white">
                            {confession.author && confession.author.displayName ? confession.author.displayName : (confession.author && confession.author.username ? confession.author.username : 'User')}
                          </span>
                        </div>
                        <div className="text-white/80 text-sm mb-3">
                          {confession.content}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/50">
                          <button 
                            className={`flex items-center gap-1 hover:text-[#875124] transition ${confession.isLiked ? 'text-red-500' : 'text-white/50'}`}
                            onClick={() => handleLike(confession.id)}
                          >
                            <Heart size={20} fill={confession.isLiked ? 'currentColor' : 'none'} />
                            <span>{confession.likes}</span>
                          </button>
                          
                          <button 
                            className="flex items-center gap-1 hover:text-[#875124] transition"
                            onClick={() => handleComment(confession.id)}
                          >
                            <MessageCircle size={20} />
                            <span>{confession.comments}</span>
                          </button>
                          
                          <button 
                            className="flex items-center gap-1 hover:text-[#875124] transition"
                            onClick={() => handleShare(confession.id)}
                          >
                            <Share size={20} />
                            <span>{confession.shares}</span>
                          </button>
                          
                          <div className="flex items-center gap-1 text-xs text-white/50">
                            <Clock size={14} />
                            <span>{confession.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!confession.author || confession.author.id !== JSON.parse(localStorage.getItem('user'))?.id ? (
                      <button className="absolute top-4 right-4 text-white/50 hover:text-[#875124] transition">
                        <Send size={16} />
                      </button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Feed