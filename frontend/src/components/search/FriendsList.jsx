import { useEffect, useState } from "react";

const FriendsList = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/users/friends", {
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            setFriends(data.friends);
            setFriendRequests(data.friendRequests);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    const acceptRequest = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/users/accept-request/${id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchFriends(); // Refresh the list
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    return (
        <div className="p-5 bg-gray-800 text-white rounded-lg">
            <h2 className="text-xl font-bold mb-3">Friend Requests</h2>
            {friendRequests.length === 0 ? (
                <p>No friend requests</p>
            ) : (
                friendRequests.map((user) => (
                    <div key={user._id} className="flex justify-between bg-gray-700 p-3 rounded-lg mb-2">
                        <p>{user.name}</p>
                        <button
                            className="bg-green-500 px-3 py-1 rounded"
                            onClick={() => acceptRequest(user._id)}
                        >
                            Accept
                        </button>
                    </div>
                ))
            )}

            <h2 className="text-xl font-bold mt-5 mb-3">Friends</h2>
            {friends.length === 0 ? (
                <p>No friends yet</p>
            ) : (
                friends.map((friend) => (
                    <div key={friend._id} className="bg-gray-700 p-3 rounded-lg mb-2">
                        <p>{friend.name}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendsList;
