import { useEffect, useState } from "react";
import axios from "axios";

const FriendRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
 
    // Fetch pending friend requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/friends`, {
                    withCredentials: true,
                });
                setRequests(response.data.friendRequests);
            } catch (err) {
                console.error("Error fetching requests:", err);
                setError("Failed to load friend requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [BASE_URL]);

    // Accept friend request
    const acceptRequest = async (senderId) => {
        try {
            await axios.post(`${BASE_URL}/api/accept-request/${senderId}`, {}, {
                withCredentials: true,
            });
            setRequests((prev) => prev.filter((req) => req._id !== senderId));
        } catch (err) {
            console.error("Error accepting request:", err.response?.data || err.message);
        }
    };

    if (loading) return <p className="text-center text-blue-500">Loading requests...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-4 bg-gray-800 shadow-md rounded-md">
            <h2 className="text-xl text-white mb-3">Friend Requests</h2>
            {requests.length === 0 ? (
                <p className="text-center text-gray-400">No pending requests.</p>
            ) : (
                requests.map((user) => (
                    <div key={user._id} className="p-3 bg-gray-700 rounded-lg flex justify-between items-center">
                        <span className="text-white">{user.username}</span>
                        <button
                            onClick={() => acceptRequest(user._id)}
                            className="bg-green-500 px-3 py-1 rounded text-white"
                        >
                            Accept
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendRequestsPage;
