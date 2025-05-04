import { useState, useEffect } from "react";
import axios from "axios";

const SendRequest = ({ userId }) => {
    const [requestSent, setRequestSent] = useState(false);
    const [senderId, setSenderId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the current user's ID from the `/me` API
        const fetchUserId = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/auth/me", { withCredentials: true });
                setSenderId(response.data._id); // Store sender ID
            } catch (error) {
                console.error("Error fetching user ID:", error.response?.data || error.message);
            } finally {
                setLoading(false); // Stop loading once API call is complete
            }
        };

        fetchUserId();
    }, []);

    const handleSendRequest = async () => {
        if (!senderId || !userId) {
            console.error("Error: senderId or userId is undefined, can't send request.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/users/friend-request/${userId}`,
                { senderId }, 
                { withCredentials: true }
            );
            console.log("Friend request sent:", response.data);
            setRequestSent(true);
        } catch (error) {
            console.error("Error sending friend request:", error.response?.data || error.message);
        }
    };

    if (loading) return <p className="text-gray-400">Loading...</p>;

    return requestSent ? (
        <p className="text-green-400">Request Sent</p>
    ) : (
        <button
            onClick={handleSendRequest}
            className="bg-blue-500 px-3 py-1 rounded text-white"
            disabled={!senderId} // Disable button if senderId is missing
        >
            Send Request
        </button>
    );
};

export default SendRequest;
