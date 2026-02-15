import React, { useState, useEffect } from "react";
import { ThumbsUp, RotateCcw, Clock } from "lucide-react";

function Feed() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [likedConfessions, setLikedConfessions] = useState(() => {
    try {
      const saved = localStorage.getItem("likedConfessions");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "just now";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const fetchConfessions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setConfessions([]);
        return;
      }

      const [feedRes, trendingRes] = await Promise.all([
        fetch("https://backend-confession.vercel.app/api/feed", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://backend-confession.vercel.app/api/feed/trending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!feedRes.ok || !trendingRes.ok) {
        throw new Error("API failed");
      }

      const feedData = await feedRes.json();
      const trendingData = await trendingRes.json();

      const feedArray = Array.isArray(feedData?.confessions)
        ? feedData.confessions
        : [];

      const trendingArray = Array.isArray(trendingData?.confessions)
        ? trendingData.confessions
        : [];

      const transform = (confession, isTrending = false) => ({
        id: confession?._id,
        content: confession?.content || "",
        timestamp: formatTimeAgo(confession?.createdAt),
        likes: Array.isArray(confession?.likes)
          ? confession.likes.length
          : 0,
        author: confession?.author || null,
        isTrending,
      });

      const feedConfessions = feedArray.map((c) => transform(c, false));
      const trendingConfessions = trendingArray.map((c) => transform(c, true));

      const final =
        feedConfessions.length >= 3
          ? [...trendingConfessions, ...feedConfessions]
          : feedConfessions;

      const updated = final.map((c) => ({
        ...c,
        isLiked: likedConfessions.has(c.id),
      }));

      setConfessions(updated);

      // Scroll to top after new data is loaded
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      console.error("Error fetching confessions:", error);
      setConfessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const user = getUser();
      if (!token || !user) return;

      const res = await fetch(
        `https://backend-confession.vercel.app/api/feed/${id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setConfessions((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                likes: data.liked ? c.likes + 1 : c.likes - 1,
                isLiked: data.liked,
              }
            : c
        )
      );

      const newSet = new Set(likedConfessions);
      data.liked ? newSet.add(id) : newSet.delete(id);
      setLikedConfessions(newSet);
      localStorage.setItem("likedConfessions", JSON.stringify([...newSet]));
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const renderAuthor = (author) => {
    if (!author) return "Anonymous";
    return author.displayName || author.username || "User";
  };

  return (
    <div className="bg-[#0F1014] min-h-screen text-white p-5 sm:p-6 pt-20">
      {/* Header - made sticky so it's always visible */}
      <div className="flex justify-between mt-12 items-center mb-6 sticky top-0 bg-[#0F1014] z-10 py-3 border-b border-white/5">
        <h1 className="text-2xl font-bold">Feed</h1>
        <button
          onClick={fetchConfessions}
          className="p-2.5 hover:bg-white/10 rounded-full transition-colors"
          disabled={loading}
          aria-label="Refresh feed"
        >
          <RotateCcw
            size={22}
            className={`${loading ? "animate-spin" : ""} text-white/80`}
          />
        </button>
      </div>

      {loading && (
        <div className="text-center py-12 text-white/60 animate-pulse">
          Loading fresh confessions...
        </div>
      )}

      {!loading && confessions.length === 0 && (
        <div className="text-center py-16 text-white/50">
          No confessions found yet.
        </div>
      )}

      <div className="space-y-5 max-w-2xl mx-auto">
        {confessions.map((confession) => (
          <div
            key={confession.id}
            className="bg-[#1B1C24] p-5 rounded-2xl border border-white/8 hover:border-white/15 transition-colors duration-200"
          >
            {/* Author + Time row */}
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-white/95">
                {renderAuthor(confession.author)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/50">
                <Clock size={13} />
                {confession.timestamp}
              </div>
            </div>

            {/* Content */}
            <p className="text-white/85 leading-relaxed mb-5 text-[15px]">
              {confession.content}
            </p>

            {/* Like only */}
            <div className="flex items-center">
              <button
                onClick={() => handleLike(confession.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                  ${
                    confession.isLiked
                      ? "text-blue-400 bg-blue-950/40 hover:bg-blue-950/60"
                      : "text-white/70 hover:text-blue-400 hover:bg-white/5"
                  }
                `}
              >
                <ThumbsUp
                  size={18}
                  fill={confession.isLiked ? "currentColor" : "none"}
                  strokeWidth={confession.isLiked ? 0 : 2}
                />
                <span className="font-medium">{confession.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom spacing for mobile nav */}
      <div className="h-24 sm:h-16" />
    </div>
  );
}

export default Feed;