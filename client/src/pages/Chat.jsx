import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://skillswap-cimn.onrender.com");

function Chat() {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  const chatRef = useRef(null);

  // 🔥 OPEN VIDEO CALL IN NEW TAB
  const startCall = () => {
    const roomID = [currentUser.id, id].sort().join("_");
    window.open(`/call/${roomID}`, "_blank");
  };

  // fetch user
  useEffect(() => {
    fetch("https://skillswap-cimn.onrender.com/api/auth/users")
      .then(res => res.json())
      .then(data => {
        const found = data.find(u => u._id === id);
        setUser(found);
      });
  }, [id]);

  // fetch messages
  const fetchMessages = () => {
    fetch(`https://skillswap-cimn.onrender.com/api/auth/messages/${currentUser.id}/${id}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data);

        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, 100);
      });
  };

  useEffect(() => {
    socket.emit("join", currentUser.id);

    fetch("https://skillswap-cimn.onrender.com/api/auth/mark-seen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: id,
        to: currentUser.id,
      }),
    });

    fetchMessages();

    socket.on("receive_message", (data) => {
      if (data.from === id || data.to === id) {
        setMessages(prev => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [id]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const message = {
      from: currentUser.id,
      to: id,
      text,
    };

    await fetch("https://skillswap-cimn.onrender.com/api/auth/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    socket.emit("send_message", message);
    setMessages(prev => [...prev, message]);
    setText("");

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="h-[calc(100vh-65px)] bg-gray-950 text-white flex flex-col">

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
        
        {/* USER INFO (CLEAN) */}
        <div>
          <h2 className="text-lg font-semibold">
            {user?.name || "Chat"}
          </h2>
          <p className="text-sm text-gray-400">
            {user?.email}
          </p>
        </div>

        {/* VIDEO CALL BUTTON */}
        <button
          onClick={startCall}
          className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Video Call
        </button>
      </div>

      {/* MESSAGES */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
      >
        <div className="max-w-4xl mx-auto w-full space-y-3">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === currentUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl text-sm max-w-xs shadow-md ${
                  msg.from === currentUser.id
                    ? "bg-blue-600 text-right"
                    : "bg-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto flex gap-3">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Type a message..."
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 px-5 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>

        </div>
      </div>

    </div>
  );
}

export default Chat;
