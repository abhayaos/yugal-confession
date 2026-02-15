import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, RefreshCw, UserX, AlertTriangle } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [confessions, setConfessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("confessions"); // "confessions" | "users"

  // Simple hardcoded admin check (for demo / development)
  // In production → use real JWT + role from backend
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      setIsAuthorized(true);
      fetchData();
      return;
    }

    // Simple prompt-based login (replace with proper auth in production!)
    const username = prompt("Enter admin username:");
    const password = prompt("Enter admin password:");

    if (username === "admin" && password === "admin123") {
      alert("Admin access granted 🔐");
      localStorage.setItem("token", "admin-token-fake");
      localStorage.setItem("role", "admin");
      setIsAuthorized(true);
      fetchData();
    } else {
      alert("Access denied ❌");
      navigate("/");
    }
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      // 1. Fetch all confessions
      const confessionsRes = await fetch("https://backend-confession.vercel.app/api/admin/confessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!confessionsRes.ok) throw new Error("Failed to fetch confessions");

      const confessionsData = await confessionsRes.json();
      setConfessions(confessionsData.confessions || []);

      // 2. Fetch all users (assuming endpoint exists)
      const usersRes = await fetch("https://backend-confession.vercel.app/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!usersRes.ok) throw new Error("Failed to fetch users");

      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this confession?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://backend-confession.vercel.app/api/admin/confessions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      // Remove from UI
      setConfessions((prev) => prev.filter((c) => c._id !== id));
      alert("Confession deleted successfully");
    } catch (err) {
      alert("Failed to delete confession: " + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user and ALL their content? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://backend-confession.vercel.app/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("User deletion failed");

      // Remove from UI
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1014] to-black text-white pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">Manage content & users</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 text-red-300 p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button
            onClick={() => setActiveTab("confessions")}
            className={`px-5 py-3 font-medium transition-colors ${
              activeTab === "confessions"
                ? "border-b-2 border-amber-500 text-amber-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Confessions
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-3 font-medium transition-colors ${
              activeTab === "users"
                ? "border-b-2 border-amber-500 text-amber-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Users
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading admin data...</div>
        ) : (
          <>
            {/* Confessions Tab */}
            {activeTab === "confessions" && (
              <div className="space-y-4">
                {confessions.length === 0 ? (
                  <p className="text-center py-12 text-zinc-500">No confessions found</p>
                ) : (
                  confessions.map((conf) => (
                    <div
                      key={conf._id}
                      className="bg-[#1B1C24] p-5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">
                            {conf.author?.displayName || conf.author?.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {new Date(conf.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteConfession(conf._id)}
                          className="text-red-400 hover:text-red-300 opacity-70 hover:opacity-100 transition p-2 rounded-lg hover:bg-red-950/30"
                          title="Delete confession"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-zinc-200 leading-relaxed">{conf.content}</p>
                      <div className="mt-3 text-sm text-zinc-500">
                        Likes: {conf.likes?.length || 0}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-center py-12 text-zinc-500">No users found</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="bg-[#1B1C24] p-5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all group flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {user.displayName || user.username || "Unknown"}
                        </p>
                        <p className="text-sm text-zinc-500">{user.email}</p>
                        <p className="text-xs text-zinc-600 mt-1">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-950/60 hover:bg-red-900/70 text-red-300 rounded-lg transition"
                        title="Delete user and all their content"
                      >
                        <UserX size={18} />
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;