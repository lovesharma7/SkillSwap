const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  family: 4, // 🔥 THIS FIXES YOUR ERROR
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ Mongo Error:", err));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("SkillSwap API is running 🚀");
});

// ✅ Test DB Route
app.get("/test", async (req, res) => {
  res.json({ message: "Backend + DB working ✅" });
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
