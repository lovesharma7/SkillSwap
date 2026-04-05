const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      skillsOffered: [],
      skillsWanted: [],
    });

    await user.save();

    res.json({ message: "User registered successfully ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE SKILLS =================
router.post("/update-skills", async (req, res) => {
  try {
    const { userId, skillsOffered, skillsWanted } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        skillsOffered,
        skillsWanted,
      },
      { new: true }
    );

    res.json({
      message: "Skills updated ✅",
      user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ALL USERS =================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET SINGLE USER =================
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const Request = require("../models/Request");

// ================= SEND REQUEST =================
router.post("/send-request", async (req, res) => {
  try {
    const { from, to } = req.body;

    const existing = await Request.findOne({ from, to });

    if (existing) {
      if (existing.status === "pending") {
        return res.json({ message: "Request already pending" });
      }

      if (existing.status === "accepted") {
        return res.json({ message: "Already connected" });
      }

      // ✅ If declined → allow new request
      if (existing.status === "declined") {
        existing.status = "pending";
        await existing.save();
        return res.json({ message: "Request sent again" });
      }
    }

    const request = new Request({ from, to });
    await request.save();

    res.json({ message: "Request sent" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET REQUESTS =================
router.get("/requests/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const sent = await Request.find({ from: userId })
      .populate("to", "name email");

    const received = await Request.find({ to: userId })
      .populate("from", "name email");

    res.json({ sent, received });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE REQUEST =================
router.post("/update-request", async (req, res) => {
  try {
    const { requestId, status } = req.body;

    await Request.findByIdAndUpdate(requestId, { status });

    res.json({ message: "Request updated" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const Message = require("../models/Message");

// ================= SEND MESSAGE =================
router.post("/send-message", async (req, res) => {
  try {
    const { from, to, text } = req.body;

    const message = new Message({ from, to, text });
    await message.save();

    res.json({ message: "Sent" });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// ================= GET MESSAGES =================
router.get("/messages/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

router.get("/chat-users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const requests = await Request.find({
      status: "accepted",
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from", "name email")
      .populate("to", "name email");

    // 🔥 Deduplicate users
    const usersMap = new Map();

    requests.forEach((r) => {
      const otherUser =
        r.from._id.toString() === userId ? r.to : r.from;

      usersMap.set(otherUser._id.toString(), otherUser);
    });

    const uniqueUsers = Array.from(usersMap.values());

    res.json(uniqueUsers);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UNREAD COUNT =================
router.get("/unread/:userId", async (req, res) => {
  const count = await Message.countDocuments({
    to: req.params.userId,
    seen: false,
  });

  res.json({ count });
});

// ================= UNREAD PER USER =================
router.get("/unread-user/:me/:other", async (req, res) => {
  const { me, other } = req.params;

  const count = await Message.countDocuments({
    from: other,
    to: me,
    seen: false,
  });

  res.json({ count });
});

// ================= MARK AS SEEN =================
router.post("/mark-seen", async (req, res) => {
  const { from, to } = req.body;

  await Message.updateMany(
    { from, to, seen: false },
    { seen: true }
  );

  res.json({ message: "Seen updated" });
});

module.exports = router;
