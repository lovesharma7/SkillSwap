import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Requests() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`https://skillswap-cimn.onrender.com/api/auth/requests/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSent(data.sent);
        setReceived(data.received);
      });
  }, []);

  const updateRequest = async (id, status) => {
    await fetch("https://skillswap-cimn.onrender.com/api/auth/update-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId: id, status }),
    });

    window.location.reload();
  };

  const formatStatus = (s) =>
    s.charAt(0).toUpperCase() + s.slice(1);

  // 🔥 SORT FUNCTION (NEW)
  const sortByLatest = (arr) =>
    [...arr].sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt);
      const timeB = new Date(b.updatedAt || b.createdAt);
      return timeB - timeA;
    });

  return (
    <div className="h-full overflow-y-auto bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-semibold mb-6">Requests</h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* RECEIVED */}
          <div>
            <h2 className="text-lg mb-4 text-gray-300">Received</h2>

            {received.length === 0 && (
              <p className="text-gray-500 text-sm">No received requests</p>
            )}

            {sortByLatest(received).map((r) => (
              <div
                key={r._id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg mb-4"
              >
                <p className="text-sm text-gray-400">
                  From: {r.from?.name}
                </p>

                <p className="text-xs text-gray-500 mb-2">
                  {r.from?.email}
                </p>

                <p className="text-sm mb-2">
                  Status: {formatStatus(r.status)}
                </p>

                {r.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateRequest(r._id, "accepted")}
                      className="bg-green-600 px-3 py-1 rounded text-sm"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateRequest(r._id, "declined")}
                      className="bg-red-600 px-3 py-1 rounded text-sm"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {r.status === "accepted" && (
                  <button
                    onClick={() => navigate(`/chat/${r.from._id}`)}
                    className="mt-3 bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Chat
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* SENT */}
          <div>
            <h2 className="text-lg mb-4 text-gray-300">Sent</h2>

            {sent.length === 0 && (
              <p className="text-gray-500 text-sm">No sent requests</p>
            )}

            {sortByLatest(sent).map((r) => (
              <div
                key={r._id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg mb-4"
              >
                <p className="text-sm text-gray-400">
                  To: {r.to?.name}
                </p>

                <p className="text-xs text-gray-500 mb-2">
                  {r.to?.email}
                </p>

                <p className="text-sm mb-2">
                  Status: {formatStatus(r.status)}
                </p>

                {r.status === "accepted" && (
                  <button
                    onClick={() => navigate(`/chat/${r.to._id}`)}
                    className="mt-3 bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Chat
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Requests;
