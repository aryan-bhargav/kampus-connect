import './App.css';
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from './components/Navbar';
import Background from './components/Background';
import Home from './pages/Home';
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from './pages/Dashboard';
import SearchUser from './pages/SearchUser';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation(); // ✅ Detects route changes

  return (
    <div className="relative">
      {/* ✅ Background stays fixed across all pages */}
      <Background />

      {/* ✅ Navbar (persists on all pages) */}
      <Navbar />

      {/* ✅ Animated Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname} // Re-animates when route changes
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/searchuser" element={<SearchUser />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/messages" element={<Messages />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
