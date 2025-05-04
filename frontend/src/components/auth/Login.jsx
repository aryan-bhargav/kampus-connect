import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";

// ✅ Use .env value
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            if (response.status === 200) {
                Cookies.set("token", response.data.token, { expires: 7 });
                alert("Login Successful");
                navigate("/");
            }
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center h-screen px-6 text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 md:p-8 max-w-md w-full"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Login to Kampuss</h2>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-500 text-white p-2 rounded-md text-sm mb-4 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-white/30 bg-white/10 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white backdrop-blur-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-white/30 bg-white/10 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white backdrop-blur-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                        <FaRocket /> Sign in
                    </motion.button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{" "}
                        <a href="/signup" className="font-medium text-blue-500 hover:text-blue-400">Sign up</a>
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default Login;
