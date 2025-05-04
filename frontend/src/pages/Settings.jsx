import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Settings = () => {
    const [notifications, setNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Using the base URL from environment variables
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Replace hardcoded URL with dynamic BASE_URL
        axios.get(`${BASE_URL}/settings`, { withCredentials: true })
            .then(response => {
                setNotifications(response.data.notifications);
                setDarkMode(response.data.darkMode);
            })
            .catch(error => console.error("Error fetching settings:", error));
    }, [BASE_URL]);

    const updateSettings = async () => {
        try {
            // Replace hardcoded URL with dynamic BASE_URL
            await axios.put(`${BASE_URL}/settings`, { notifications, darkMode }, { withCredentials: true });
            alert("Settings updated");
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-white">
            {/* Settings Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-6 md:p-8 max-w-2xl w-full"
            >
                <h2 className="text-4xl font-bold text-white mb-4 text-center">Settings</h2>

                {/* Notification Toggle */}
                <label className="flex items-center justify-between w-full mb-4">
                    <span className="text-lg">Enable Notifications</span>
                    <input 
                        type="checkbox" 
                        checked={notifications} 
                        onChange={() => setNotifications(!notifications)} 
                        className="w-5 h-5 cursor-pointer"
                    />
                </label>

                {/* Dark Mode Toggle */}
                <label className="flex items-center justify-between w-full mb-4">
                    <span className="text-lg">Dark Mode</span>
                    <input 
                        type="checkbox" 
                        checked={darkMode} 
                        onChange={() => setDarkMode(!darkMode)} 
                        className="w-5 h-5 cursor-pointer"
                    />
                </label>

                {/* Save Settings Button */}
                <button 
                    onClick={updateSettings} 
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                    Save Settings
                </button>
            </motion.div>
        </section>
    );
};

export default Settings;
