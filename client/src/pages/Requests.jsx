import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Requests() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/requests/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSent(data.sent);
        setReceived(data.received);
      });
  }, []);

  const updateRequest = async (id, status) => {
    await fetch("http://localhost:5000/api/auth/update-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId: id, status }),
    });

    window.location.reload();
  };

  const formatStatus = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="h-full overflow-y-auto bg-gray-950 text-white p-8">

      <h1 className="text-2xl mb-8">Requests</h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* RECEIVED */}
        <div>
          <h2 className="mb-4 text-lg text-gray-300">Received</h2>

          {[...received]
            .sort((a, b) => {
              if (a.status === "pending" && b.status !== "pending") return -1;
              if (a.status !== "pending" && b.status === "pending") return 1;
              return 0;
            })
            .map((r) => (
              <div key={r._id} className="bg-gray-900 p-4 rounded mb-4 border border-gray-800">

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
                  <div className="flex gap-2">
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
                    className="mt-2 bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Chat
                  </button>
                )}

              </div>
            ))}
        </div>

        {/* SENT */}
        <div>
          <h2 className="mb-4 text-lg text-gray-300">Sent</h2>

          {[...sent]
            .sort((a, b) => {
              if (a.status === "pending" && b.status !== "pending") return -1;
              if (a.status !== "pending" && b.status === "pending") return 1;
              return 0;
            })
            .map((r) => (
              <div key={r._id} className="bg-gray-900 p-4 rounded mb-4 border border-gray-800">

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
                    className="mt-2 bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Chat
                  </button>
                )}

              </div>
            ))}
        </div>

      </div>
    </div>
  );
}

export default Requests;
