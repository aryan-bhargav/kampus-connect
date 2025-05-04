import { useState } from "react";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const AcceptRequest = ({ senderId, onAccepted }) => {
    const [accepted, setAccepted] = useState(false);

    const handleAccept = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/accept-request/${senderId}`,
                {},
                { withCredentials: true }
            );
            console.log(response.data.message);
            setAccepted(true);
            if (onAccepted) onAccepted(senderId);
        } catch (error) {
            console.error("Error accepting request:", error.response?.data || error.message);
        }
    };

    return (
        accepted ? (
            <p className="text-green-400">Accepted</p>
        ) : (
            <button
                onClick={handleAccept}
                className="bg-green-500 px-3 py-1 rounded text-white"
            >
                Accept
            </button>
        )
    );
};

export default AcceptRequest;
