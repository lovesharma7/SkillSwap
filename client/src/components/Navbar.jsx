import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [requestCount, setRequestCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    const fetchData = () => {
      // 🔔 REQUESTS
      fetch(`http://localhost:5000/api/auth/requests/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const pending = data.received.filter(r => r.status === "pending");
          setRequestCount(pending.length);
        });

      // 💬 CHAT NOTIFICATIONS
      fetch(`http://localhost:5000/api/auth/unread/${user.id}`)
        .then(res => res.json())
        .then(data => setChatCount(data.count));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-8 py-4 flex justify-between items-center">

      <Link to="/discover" className="text-xl font-semibold text-white">
        SkillSwap
      </Link>

      <div className="flex gap-6 items-center text-gray-300">

        <Link to="/discover">Discover</Link>
        <Link to="/profile">Profile</Link>

        {/* REQUESTS */}
        <div className="relative">
          <Link to="/requests">Requests</Link>
          {requestCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-xs px-2 py-0.5 rounded-full">
              {requestCount}
            </span>
          )}
        </div>

        {/* CHATS */}
        <div className="relative">
          <Link to="/chats">Chats</Link>
          {chatCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-xs px-2 py-0.5 rounded-full">
              {chatCount}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-blue-600 px-4 py-1.5 rounded text-white"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
