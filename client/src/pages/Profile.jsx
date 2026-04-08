import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    skillsOffered: "",
    skillsWanted: "",
  });

  const [saved, setSaved] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  fetch(`http://localhost:5000/api/auth/profile/${currentUser.id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.skillsOffered) return;

      setProfile({
        skillsOffered: data.skillsOffered.join(", "),
        skillsWanted: data.skillsWanted.join(", "),
      });

      setSaved(true);
    })
    .catch(() => {});
}, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    await fetch("http://localhost:5000/api/auth/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.id,
        skillsOffered: profile.skillsOffered.split(",").map(s => s.trim()),
        skillsWanted: profile.skillsWanted.split(",").map(s => s.trim()),
      }),
    });

    setSaved(true);
    alert("Profile saved");
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-950 text-white p-8">
      <div className="max-w-xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold mb-6 tracking-tight text-center">
          Profile
        </h1>

        {/* CARD */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg space-y-5">

          {/* USER INFO */}
          <div className="text-center">
            <p className="text-lg font-medium">{currentUser.name}</p>
            <p className="text-sm text-gray-400">{currentUser.email}</p>
          </div>

          {/* SKILLS OFFERED */}
          <div>
            <label className="text-sm text-gray-400">Skills Offered</label>
            <input
              type="text"
              name="skillsOffered"
              value={profile.skillsOffered}
              onChange={handleChange}
              placeholder="e.g. React, Java, Photoshop"
              className="w-full mt-1 p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* SKILLS WANTED */}
          <div>
            <label className="text-sm text-gray-400">Skills Wanted</label>
            <input
              type="text"
              name="skillsWanted"
              value={profile.skillsWanted}
              onChange={handleChange}
              placeholder="e.g. Node.js, UI Design"
              className="w-full mt-1 p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {saved ? "Update Profile" : "Save Profile"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;
