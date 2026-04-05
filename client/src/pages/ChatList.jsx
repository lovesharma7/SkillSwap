import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ChatList() {
  const [users, setUsers] = useState([]);
  const [unread, setUnread] = useState({});

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // fetch chat users
  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/chat-users/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // fetch unread counts
  useEffect(() => {
    users.forEach(u => {
      fetch(`http://localhost:5000/api/auth/unread-user/${currentUser.id}/${u._id}`)
        .then(res => res.json())
        .then(data => {
          setUnread(prev => ({
            ...prev,
            [u._id]: data.count
          }));
        });
    });
  }, [users]);

  return (
    <div className="h-full overflow-y-auto bg-gray-950 text-white p-8">

      <h1 className="text-2xl mb-6">Chats</h1>

      {/* 🔥 SORTED USERS */}
      {[...users]
        .sort((a, b) => (unread[b._id] || 0) - (unread[a._id] || 0))
        .map(u => (
          <div
            key={u._id}
            onClick={() => navigate(`/chat/${u._id}`)}
            className="bg-gray-900 p-4 rounded mb-3 cursor-pointer flex justify-between items-center hover:border border-gray-700"
          >
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-400">{u.email}</p>
            </div>

            {/* 🔔 UNREAD BADGE */}
            {unread[u._id] > 0 && (
              <span className="bg-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-medium">
                {unread[u._id]}
              </span>
            )}
          </div>
        ))}

    </div>
  );
}

export default ChatList;
