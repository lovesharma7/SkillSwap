import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ChatList() {
  const [users, setUsers] = useState([]);
  const [unread, setUnread] = useState({});
  const [lastMessage, setLastMessage] = useState({});

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // fetch chat users
  useEffect(() => {
    fetch(`https://skillswap-cimn.onrender.com/api/auth/chat-users/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // fetch unread counts
  useEffect(() => {
    users.forEach(u => {
      fetch(`https://skillswap-cimn.onrender.com/api/auth/unread-user/${currentUser.id}/${u._id}`)
        .then(res => res.json())
        .then(data => {
          setUnread(prev => ({
            ...prev,
            [u._id]: data.count
          }));
        });
    });
  }, [users]);

  // 🔥 fetch last message time (NEW)
  useEffect(() => {
    users.forEach(u => {
      fetch(`https://skillswap-cimn.onrender.com/api/auth/messages/${currentUser.id}/${u._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const last = data[data.length - 1];

            setLastMessage(prev => ({
              ...prev,
              [u._id]: new Date(last.createdAt).getTime()
            }));
          }
        });
    });
  }, [users]);

  return (
    <div className="h-full overflow-y-auto bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-semibold mb-6 tracking-tight">
          Chats
        </h1>

        {users.length === 0 && (
          <p className="text-gray-500">No chats yet</p>
        )}

        <div className="space-y-4">

          {[...users]
            .sort((a, b) => {
              const timeA = lastMessage[a._id] || 0;
              const timeB = lastMessage[b._id] || 0;
              return timeB - timeA;
            })
            .map((u) => (
              <div
                key={u._id}
                onClick={() => navigate(`/chat/${u._id}`)}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.01] transition cursor-pointer flex justify-between items-center"
              >

                <div>
                  <p className="font-medium text-base">{u.name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                </div>

                {unread[u._id] > 0 && (
                  <span className="bg-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-medium shadow">
                    {unread[u._id]}
                  </span>
                )}

              </div>
            ))}

        </div>

      </div>
    </div>
  );
}

export default ChatList;
