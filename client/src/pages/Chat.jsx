import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatRef = useRef(null);

  // ✅ Fetch messages from DB
  const fetchMessages = () => {
    fetch(`http://localhost:5000/api/auth/messages/${currentUser.id}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const container = chatRef.current;

        if (container) {
          const isNearBottom =
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
            100;

          setMessages(data);

          if (isNearBottom) {
            setTimeout(() => {
              container.scrollTop = container.scrollHeight;
            }, 100);
          }
        }
      });
  };

  useEffect(() => {
    // ✅ Join socket room
    socket.emit("join", currentUser.id);

    // ✅ Mark messages as seen
    fetch("http://localhost:5000/api/auth/mark-seen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: id,
        to: currentUser.id,
      }),
    });

    // ✅ Load previous messages
    fetchMessages();

    // ✅ Listen for realtime messages
    socket.on("receive_message", (data) => {
      if (data.from === id || data.to === id) {
        setMessages((prev) => [...prev, data]);

        // auto scroll
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, 100);
      }
    });

    return () => socket.off("receive_message");
  }, [id]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const message = {
      from: currentUser.id,
      to: id,
      text,
    };

    // 🔥 Save to DB
    await fetch("http://localhost:5000/api/auth/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    // 🔥 Send via socket
    socket.emit("send_message", message);

    // 🔥 Show instantly
    setMessages((prev) => [...prev, message]);

    setText("");

    // auto scroll
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="bg-gray-950 text-white flex flex-col h-[calc(100vh-65px)]">

      {/* MESSAGES */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-6 space-y-3"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
              msg.from === currentUser.id
                ? "bg-blue-600 ml-auto text-right"
                : "bg-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-800 flex gap-2 bg-gray-950">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 bg-gray-800 rounded text-white outline-none"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default Chat;
