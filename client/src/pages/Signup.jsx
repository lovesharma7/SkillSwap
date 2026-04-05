import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful 🎉");
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <form className="bg-gray-800 p-8 rounded-2xl w-80 space-y-4 shadow-xl" onSubmit={handleSubmit}>
        <h2 className="text-white text-2xl text-center font-bold">Signup</h2>

        <input name="name" placeholder="Name" onChange={handleChange}
          className="w-full p-2 bg-gray-700 text-white rounded" />

        <input name="email" placeholder="Email" onChange={handleChange}
          className="w-full p-2 bg-gray-700 text-white rounded" />

        <input name="password" placeholder="Password" type="password" onChange={handleChange}
          className="w-full p-2 bg-gray-700 text-white rounded" />

        <button className="w-full bg-blue-500 p-2 rounded text-white hover:bg-blue-600">
          Signup
        </button>

        <p className="text-gray-400 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
