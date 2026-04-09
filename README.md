# 🚀 SkillSwap

SkillSwap is a full-stack web application that allows users to **exchange skills with each other**. Users can offer skills they are good at and learn new skills from others through real-time chat and video sessions.

---

## 🌟 Features

* 🔐 User Authentication (Login / Signup)
* 👤 Profile with Skills Offered & Wanted
* 🔍 Discover Users based on skills
* 🤝 Send & Manage Requests
* 💬 Real-time Chat using Socket.IO
* 🔔 Notifications for Requests & Messages
* 🎥 Video Calling using ZegoCloud
* 🌐 Fully Responsive UI (React + Tailwind)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Real-time & Communication

* Socket.IO (Chat)
* ZegoCloud (Video Calls)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📸 Demo Flow

1. User Signup / Login
2. Add skills in Profile
3. Discover users
4. Send request
5. Accept request
6. Start chatting
7. Initiate video call for learning session

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/skillswap.git
cd skillswap
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
PORT=5000
```

Run server:

```bash
node server.js
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🌍 Deployment

* Frontend deployed on **Vercel**
* Backend deployed on **Render**

---

## 🧠 Future Improvements

* Real-time online status
* Skill rating system
* Session scheduling
* File sharing in chat
* Advanced search filters

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork this repository and improve it.

---

## 👨‍💻 Author

Developed by **Love Sharma**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
