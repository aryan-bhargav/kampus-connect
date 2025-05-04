import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaEnvelope, FaCog, FaSignOutAlt, FaHome } from "react-icons/fa";

const Sidebar = () => {
    return (
        <aside className="w-64 bg-[#1C2541] h-screen p-5 flex flex-col text-white">
            <h1 className="text-2xl font-bold mb-6">Kampus Konnect</h1>

            <nav className="flex-1">
                <ul className="space-y-4">
                    {/* Home Link */}
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-2 rounded-lg transition ${isActive ? "bg-[#3A506B]" : "hover:bg-[#2A3C58]"}` 
                            }
                        >
                            <FaHome />
                            <span>Home</span>
                        </NavLink>
                    </li>

                    {/* Search User Link */}
                    <li>
                        <NavLink
                            to="/searchuser"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-2 rounded-lg transition ${isActive ? "bg-[#3A506B]" : "hover:bg-[#2A3C58]"}` 
                            }
                        >
                            <FaTachometerAlt />
                            <span>Search User</span>
                        </NavLink>
                    </li>

                    {/* Dashboard Link */}
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-2 rounded-lg transition ${isActive ? "bg-[#3A506B]" : "hover:bg-[#2A3C58]"}` 
                            }
                        >
                            <FaTachometerAlt />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>

                    {/* Profile Link */}
                    <li>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-2 rounded-lg transition ${isActive ? "bg-[#3A506B]" : "hover:bg-[#2A3C58]"}` 
                            }
                        >
                            <FaUser />
                            <span>Profile</span>
                        </NavLink>
                    </li>

                    {/* Messages Link */}
                    <li>
                        <NavLink
                            to="/messages"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-2 rounded-lg transition ${isActive ? "bg-[#3A506B]" : "hover:bg-[#2A3C58]"}` 
                            }
                        >
                            <FaEnvelope />
                            <span>Messages</span>
                        </NavLink>
                    </li>

                    {/* Settings Link */}
                    <li>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-2 rounded-lg transition ${isActive ? "bg-[#3A506B]" : "hover:bg-[#2A3C58]"}` 
                            }
                        >
                            <FaCog />
                            <span>Settings</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
