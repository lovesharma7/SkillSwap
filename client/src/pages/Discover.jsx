import { useEffect, useState } from "react";

function Discover() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("https://skillswap-cimn.onrender.com/api/auth/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // 🔍 FILTER USERS BASED ON SEARCH
  const filteredUsers = users.filter((user) => {
    if (user._id === currentUser.id) return false;

    const skills = (user.skillsOffered || []).join(" ").toLowerCase();
    return skills.includes(search.toLowerCase());
  });

  return (
    <div className="h-full overflow-y-auto bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-semibold mb-6 tracking-tight">
          Discover Users
        </h1>

        {/* 🔍 SEARCH BAR */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by skills (e.g. React, Java)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* EMPTY STATE */}
        {filteredUsers.length === 0 && (
          <p className="text-gray-500">No users found</p>
        )}

        {/* USERS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const offered = user.skillsOffered || [];
            const wanted = currentUser.skillsWanted || [];

            const match = offered.some((skill) =>
              wanted.includes(skill)
            );

            return (
              <div
                key={user._id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300"
              >
                <h2 className="text-lg font-semibold">{user.name}</h2>

                <p className="text-gray-400 text-sm mb-3">
                  {user.email}
                </p>

                <div className="mb-2">
                  <p className="text-gray-400 text-xs">Offers</p>
                  <p className="text-sm">{offered.join(", ") || "None"}</p>
                </div>

                <div className="mb-2">
                  <p className="text-gray-400 text-xs">Wants</p>
                  <p className="text-sm">
                    {(user.skillsWanted || []).join(", ") || "None"}
                  </p>
                </div>

                {match && (
                  <div className="mt-2 text-blue-400 text-sm">
                    Match available
                  </div>
                )}

                <button
                  className="mt-3 w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={async () => {
                    const res = await fetch(
                      "https://skillswap-cimn.onrender.com/api/auth/send-request",
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
                >
                  Request
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Discover;
