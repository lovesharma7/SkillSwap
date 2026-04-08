import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    // 🔥 VALIDATION
    if (!form.email.trim() || !form.password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // reload fix
        window.location.href = "/discover";
      } else {
        alert(data.message);
      }

    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">

      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 p-7 rounded-xl border border-gray-700 shadow-lg">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Welcome Back
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-5 p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Login
        </button>

        {/* LINK */}
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
