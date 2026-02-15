import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      setIsAuthorized(true);
      return;
    }

    // Prompt login
    const username = prompt("Enter admin username:");
    const password = prompt("Enter admin password:");

    if (username === "admin" && password === "admin123") {
      alert("Admin access granted 🔐");

      localStorage.setItem("token", "admin-token");
      localStorage.setItem("role", "admin");

      setIsAuthorized(true);
    } else {
      alert("Access denied ❌");
      navigate("/");
    }
  }, [navigate]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 pb-24">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-[#1B1C24] p-4 rounded-xl">
        <p>Welcome Admin 👑</p>
      </div>
    </div>
  );
};

export default Admin;
