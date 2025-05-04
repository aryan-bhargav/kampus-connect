import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Profile = () => {
    const [id, setId] = useState(null);
    const [username, setUsername] = useState("");
    const [currentUsername, setCurrentUsername] = useState("");
    const [message, setMessage] = useState("");
    const [isAvailable, setIsAvailable] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/api/auth/me", { withCredentials: true })
            .then(response => {
                setId(response.data._id);
                setCurrentUsername(response.data.username || "Not Set");
            })
            .catch(error => console.error("Error fetching user data:", error));
    }, []);

    const checkUsernameAvailability = async () => {
        if (!username) return;
        try {
            const response = await axios.get(`http://localhost:8000/api/users/check-username?username=${username}`);
            setMessage(response.data.message);
            setIsAvailable(true);
        } catch (error) {
            setMessage(error.response?.data?.message || "Username not available");
            setIsAvailable(false);
        }
    };

    const updateUsername = async () => {
        if (!isAvailable || !id) return;
        try {
            const response = await axios.put(
                "http://localhost:8000/api/users/update-username",
                { id, username },
                { withCredentials: true }
            );
            setMessage(response.data.message);
            setCurrentUsername(username);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error updating username");
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg rounded-2xl p-6 md:p-8 max-w-2xl w-full"
            >
                <h2 className="text-4xl font-bold text-white mb-4">Profile</h2>
                <h3 className="text-2xl font-semibold text-gray-200 mb-4">Change Username</h3>
                <p className="text-gray-300 mb-2">
                    <strong>Current Username:</strong> {currentUsername}
                </p>

                {/* Input Field */}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                {/* Check Availability Button */}
                <button
                    onClick={checkUsernameAvailability}
                    className="w-full mt-3 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition shadow-md"
                >
                    Check Availability
                </button>

                {/* Message Display */}
                {message && (
                    <p className={`mt-2 text-sm ${isAvailable ? "text-green-400" : "text-red-400"}`}>
                        {message}
                    </p>
                )}

                {/* Save Username Button */}
                <button
                    onClick={updateUsername}
                    disabled={!isAvailable}
                    className={`w-full mt-3 px-4 py-2 rounded-lg transition shadow-md ${
                        isAvailable ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-600 cursor-not-allowed"
                    }`}
                >
                    Save Username
                </button>
            </motion.div>
        </section>
    );
};

export default Profile;
