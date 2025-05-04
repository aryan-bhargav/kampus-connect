import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import FriendsList from "../components/FriendsList";
import RealtimeMap from "../components/RealtimeMap";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/auth/me", {
                    withCredentials: true,
                });
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 text-white overflow-hidden">
            {/* Dashboard Content */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 mt-20 flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 max-w-4xl shadow-lg w-full"
            >
                {/* Friends Section */}
                <div className="md:w-1/3 bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-md border border-white/15 w-full">
                    <h3 className="text-lg font-semibold border-b border-white/20 pb-2 mb-3">Friends</h3>
                    <FriendsList />
                </div>

                {/* Realtime Map Section */}
                <div className="md:w-2/3 bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-md border border-white/15 w-full mt-4 md:mt-0 md:ml-4">
                    <h3 className="text-lg font-semibold border-b border-white/20 pb-2 mb-3">Realtime Map</h3>
                    <RealtimeMap userId={user?._id} username={user?.name} />
                </div>
            </motion.div>
        </section>
    );
};

export default Dashboard;
