import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">

        <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-6">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Learn.
          </span>{" "}
          Teach. Connect.
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          SkillSwap is a platform where you can exchange skills with people around the world.
          Teach what you know and learn what you love — all in one place.
        </p>

        {/* 🔥 FIXED BUTTONS */}
        <div className="flex justify-center gap-4">
          {user ? (
            <Link
              to="/discover"
              className="bg-blue-600 px-7 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-blue-600 px-7 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="border border-gray-700 px-7 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>

      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">

        {[
          {
            title: "Skill Matching",
            desc: "Find people who offer what you need and need what you offer.",
          },
          {
            title: "Real-time Chat",
            desc: "Communicate instantly with users using live messaging.",
          },
          {
            title: "Smart Requests",
            desc: "Send, accept, and manage collaboration requests easily.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.03] transition duration-300"
          >
            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}

      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">

        <h2 className="text-3xl font-semibold mb-12">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            { step: "1", title: "Create Profile", desc: "Add your skills and interests." },
            { step: "2", title: "Discover Users", desc: "Find people with matching skills." },
            { step: "3", title: "Start Learning", desc: "Chat and exchange knowledge." },
          ].map((item, i) => (
            <div key={i}>
              <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-600 text-white font-medium">
                {item.step}
              </div>
              <h4 className="font-medium mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}

        </div>

      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">

        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-gray-700 rounded-xl p-10 shadow-lg">

          <h2 className="text-2xl font-semibold mb-4">
            Start exchanging skills today
          </h2>

          <p className="text-gray-400 mb-6">
            Join SkillSwap and connect with people who can help you grow.
          </p>

          <Link
            to={user ? "/discover" : "/signup"}
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {user ? "Go to App" : "Create Account"}
          </Link>

        </div>

      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        SkillSwap © 2026
      </div>

    </div>
  );
}

export default Home;
