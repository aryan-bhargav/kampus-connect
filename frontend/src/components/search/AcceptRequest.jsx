import { useState } from "react";
import axios from "axios";

const AcceptRequest = ({ senderId, onAccepted }) => {
    const [accepted, setAccepted] = useState(false);

    const handleAccept = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/accept-request/${senderId}`,
                {}, 
                { withCredentials: true }
            );
            console.log(response.data.message);
            setAccepted(true);
            if (onAccepted) onAccepted(senderId);  // Refresh UI
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
