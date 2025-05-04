import React, { useState, useEffect } from "react";
import axios from "axios";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/friends", {
          withCredentials: true,
        });

        if (response.data.friends) {
          setFriends(response.data.friends);
        } else {
          setFriends([]);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Failed to load friends. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <p className="text-center text-blue-500">Loading friends...</p>;

  if (error)
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="p-4 bg-blue-700 shadow-md rounded-md">
      {friends.length === 0 ? (
        <div className="text-center text-white">
          <p>You have no friends yet. 😔</p>
          <p className="text-sm">Try connecting with people!</p>
        </div>
      ) : (
        friends.map((friend) => (
          <div key={friend._id} className="p-2 border-b border-gray-300 flex justify-between">
            <span className="font-medium">{friend.username}</span>
            <span className={`ml-2 text-sm ${friend.isOnline ? "text-green-500" : "text-gray-400"}`}>
              {friend.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendsList;
