import { useEffect, useState } from "react";

function Discover() {
  const [users, setUsers] = useState([]);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  }, []);

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        Please login first
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Discover Users</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          if (user._id === currentUser.id) return null;

          const offered = user.skillsOffered || [];
          const wanted = currentUser.skillsWanted || [];

          const match = offered.some((skill) =>
            wanted.includes(skill)
          );

          return (
            <div
              key={user._id}
              className="bg-gray-900 p-5 rounded-lg border border-gray-800 hover:border-gray-600 transition"
            >
              <h2 className="text-lg font-semibold">{user.name}</h2>

              <p className="text-gray-400 text-sm mb-3">
                {user.email}
              </p>

              <div className="mb-2">
                <p className="text-gray-400 text-xs">Offers</p>
                <p className="text-sm">
                  {offered.length > 0 ? offered.join(", ") : "None"}
                </p>
              </div>

              <div className="mb-2">
                <p className="text-gray-400 text-xs">Wants</p>
                <p className="text-sm">
                  {(user.skillsWanted || []).length > 0
                    ? user.skillsWanted.join(", ")
                    : "None"}
                </p>
              </div>

              {match && (
                <div className="mt-2 text-blue-400 text-sm">
                  Match available
                </div>
              )}

              {/* ✅ REQUEST BUTTON BACK */}
              <button
                onClick={async () => {
                  const res = await fetch(
                    "http://localhost:5000/api/auth/send-request",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        from: currentUser.id,
                        to: user._id,
                      }),
                    }
                  );

                  const data = await res.json();
                  alert(data.message);
                }}
                className="mt-3 w-full bg-blue-600 py-1.5 rounded text-sm hover:bg-blue-700"
              >
                Request
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Discover;
