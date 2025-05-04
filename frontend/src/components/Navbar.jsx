import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/auth/me", { withCredentials: true });
            if (response.data) {
                setIsLoggedIn(true);
                setUser(response.data);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
            setIsLoggedIn(false);
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-1/2 bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl p-3 flex justify-between items-center border border-white/20 z-50 text-sm">
            <div className="flex items-center space-x-2">
                <img src="/favicon.webp" alt="Logo" className="w-6 h-6 rounded-full" />
                <span className="text-white text-2xl font-semibold">Kampuss</span>
            </div>

            <div className="sm:hidden text-white text-lg cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? "✖" : "☰"}
            </div>

            <ul className={`absolute sm:static top-14 right-0 bg-gray-900 sm:bg-transparent w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 sm:p-0 transition-all duration-300 ${menuOpen ? "block" : "hidden sm:flex"}`}>
                {isLoggedIn ? (
                    <>
                        {[
                            { to: "/", label: "Home" },
                            { to: "/dashboard", label: "Dashboard" },
                            { to: "/searchuser", label: "Search" },
                            { to: "/profile", label: "Profile" },
                            { to: "/messages", label: "Messages" },
                            { to: "/settings", label: "Settings" }
                        ].map(({ to, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        `text-white px-3 py-1 rounded-lg transition-all duration-300 ${isActive ? "bg-white/20 backdrop-blur-md border border-white/30 shadow-md" : "hover:text-gray-400"}`
                                    }
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                        <li>
                            <button onClick={handleLogout} className="text-white hover:text-gray-400">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/login" className={({ isActive }) => `text-white px-3 py-1 rounded-lg transition-all duration-300 ${isActive ? "bg-white/20 backdrop-blur-md border border-white/30 shadow-md" : "hover:text-gray-400"}`}>Login</NavLink></li>
                        <li><NavLink to="/signup" className={({ isActive }) => `text-white px-3 py-1 rounded-lg transition-all duration-300 ${isActive ? "bg-white/20 backdrop-blur-md border border-white/30 shadow-md" : "hover:text-gray-400"}`}>Sign Up</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
