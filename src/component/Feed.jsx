import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Share, Flame, Clock, Send, RotateCcw } from "lucide-react";

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
        comments: Array.isArray(confession?.comments)
          ? confession.comments.length
          : 0,
        shares: confession?.shares || 0,
        author: confession?.author || null,
        isTrending,
      });

      const feedConfessions = feedArray.map((c) => transform(c, false));
      const trendingConfessions = trendingArray.map((c) =>
        transform(c, true)
      );

      const final =
        feedConfessions.length >= 3
          ? [...trendingConfessions, ...feedConfessions]
          : feedConfessions;

      const updated = final.map((c) => ({
        ...c,
        isLiked: likedConfessions.has(c.id),
      }));

      setConfessions(updated);
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
      localStorage.setItem(
        "likedConfessions",
        JSON.stringify([...newSet])
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const renderAuthor = (author) => {
    if (!author) return "Anonymous";
    return author.displayName || author.username || "User";
  };

  return (
    <div className="bg-[#0F1014] mt-22 min-h-screen text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <button onClick={fetchConfessions}>
          <RotateCcw
            size={22}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && confessions.length === 0 && (
        <p className="text-white/50">No confessions found.</p>
      )}

      <div className="space-y-4">
        {confessions.map((confession) => (
          <div
            key={confession.id}
            className="bg-[#1B1C24] p-4 rounded-xl border border-white/10"
          >
            <div className="font-semibold mb-2">
              {renderAuthor(confession.author)}
            </div>

            <p className="text-white/80 text-sm mb-3">
              {confession.content}
            </p>

            <div className="flex gap-4 text-sm text-white/60">
              <button
                onClick={() => handleLike(confession.id)}
                className={`flex items-center gap-1 ${
                  confession.isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart
                  size={18}
                  fill={confession.isLiked ? "currentColor" : "none"}
                />
                {confession.likes}
              </button>

              <div className="flex items-center gap-1">
                <MessageCircle size={18} />
                {confession.comments}
              </div>

              <div className="flex items-center gap-1">
                <Share size={18} />
                {confession.shares}
              </div>

              <div className="flex items-center gap-1 ml-auto text-xs">
                <Clock size={14} />
                {confession.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
