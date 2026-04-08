import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [reqCount, setReqCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);

  const fetchNotifications = () => {
    if (!user) return;

    // 🔔 Requests
    fetch(`http://localhost:5000/api/auth/requests/${user.id}`)
      .then(res => res.json())
      .then(data => {
        const pending = data.received.filter(r => r.status === "pending");
        setReqCount(pending.length);
      });

    // 🔔 Chats
    fetch(`http://localhost:5000/api/auth/unread/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setChatCount(data.count);
      });
  };

  useEffect(() => {
    fetchNotifications(); // initial

    // 🔥 auto refresh every 3 sec
    const interval = setInterval(fetchNotifications, 3000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="h-[65px] bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">

      {/* LOGO */}
      <div
  onClick={() => navigate("/")}
  className="text-2xl md:text-3xl font-extrabold cursor-pointer tracking-tight select-none"
>
  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
    Skill
  </span>
  <span className="text-white">Swap</span>
</div>

      {/* NAV */}
      <div className="flex items-center gap-6 text-sm">

        <Link to="/" className="hover:text-blue-400">
          Home
        </Link>

        <Link to="/discover" className="hover:text-blue-400">
          Discover
        </Link>

        {/* REQUESTS */}
        <div className="relative">
          <Link to="/requests" className="hover:text-blue-400">
            Requests
          </Link>

          {reqCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {reqCount}
            </span>
          )}
        </div>

        {/* CHATS */}
        <div className="relative">
          <Link to="/chats" className="hover:text-blue-400">
            Chats
          </Link>

          {chatCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {chatCount}
            </span>
          )}
        </div>

        <Link to="/profile" className="hover:text-blue-400">
          Profile
        </Link>

        <button
          onClick={logout}
          className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;
