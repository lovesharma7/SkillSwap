import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/discover");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      <form className="bg-gray-900 p-8 rounded-xl w-80 space-y-4 border border-gray-800" onSubmit={handleSubmit}>
        
        <h2 className="text-white text-xl text-center font-medium">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700"
        />

        <button className="w-full bg-blue-600 p-2 rounded text-white hover:bg-blue-700">
          Login
        </button>

        <p className="text-gray-400 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400">
            Signup
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;
