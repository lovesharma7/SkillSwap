import { useEffect, useState } from "react";

function Profile() {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5000/api/auth/user/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.skillsOffered?.length || data.skillsWanted?.length) {
          setSkillsOffered(data.skillsOffered.join(", "));
          setSkillsWanted(data.skillsWanted.join(", "));
          setIsEditing(false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/update-skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        skillsOffered: skillsOffered.split(",").map(s => s.trim()),
        skillsWanted: skillsWanted.split(",").map(s => s.trim()),
      }),
    });

    const data = await res.json();
    alert(data.message);
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        Please login first
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">

      {/* 🔥 Title outside card */}
      <h1 className="text-2xl font-semibold text-center mb-8">
        Profile
      </h1>

      <div className="flex justify-center">
        <div className="w-full max-w-md">

          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="text-sm text-gray-400">
                    Skills You Offer
                  </label>
                  <input
                    type="text"
                    value={skillsOffered}
                    onChange={(e) => setSkillsOffered(e.target.value)}
                    className="w-full mt-1 p-2 bg-gray-800 text-white rounded border border-gray-700"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Skills You Want
                  </label>
                  <input
                    type="text"
                    value={skillsWanted}
                    onChange={(e) => setSkillsWanted(e.target.value)}
                    className="w-full mt-1 p-2 bg-gray-800 text-white rounded border border-gray-700"
                  />
                </div>

                <button className="w-full bg-blue-600 p-1.5 rounded text-white hover:bg-blue-700">
                  Save
                </button>

              </form>
            ) : (
              <div className="space-y-5">

                <div>
                  <p className="text-gray-400 text-sm">Skills You Offer</p>
                  <p className="text-white mt-1">
                    {skillsOffered || "None"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Skills You Want</p>
                  <p className="text-white mt-1">
                    {skillsWanted || "None"}
                  </p>
                </div>

                {/* 🔥 BLUE EDIT BUTTON */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 p-1.5 rounded text-white hover:bg-blue-700"
                >
                  Edit
                </button>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
