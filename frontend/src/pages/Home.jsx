import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";

const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getUser", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        setError("Please login to continue.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <section className="relative flex flex-col items-center justify-center h-screen text-center px-6 text-white">
      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 md:p-10 max-w-3xl w-full"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-2">
          {user ? `Welcome, ${user.name}! 🎉` : "Welcome to Kampuss! 🎉"}
        </h2>

        {/* Description */}
        <p className="text-gray-300 mt-3">
          Your all-in-one platform for campus networking, study resources, and event management.
        </p>

        {/* User Info (Glassmorphic Box) */}
        {user && (
          <div className="mt-6 p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg shadow-lg w-full text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Your Details:</h3>
            <div className="flex justify-between border-b border-white/20 pb-2">
              <span className="text-gray-300">College:</span>
              <span className="font-semibold text-white">{user.college}</span>
            </div>
            <div className="flex justify-between border-b border-white/20 pb-2">
              <span className="text-gray-300">Branch:</span>
              <span className="font-semibold text-white">{user.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Section:</span>
              <span className="font-semibold text-white">{user.section}</span>
            </div>
          </div>
        )}

        {/* Get Started Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-blue-500/80 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all"
        >
          <FaRocket />
          <NavLink to="/searchuser" className="text-white">Get Started</NavLink>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Home;
