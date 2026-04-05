import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";


// Layout
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* AUTH */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* MAIN APP */}
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/chats" element={<ChatList />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
