import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SearchBar from "../components/search/SearchBar";
import UserList from "../components/search/UserList";
import RecentSearches from "../components/search/RecentSearches";
import FriendsList from "../components/FriendsList";

const SearchUser = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        setRecentSearches(storedSearches);

        // Fetch suggested friends
        axios.get("http://localhost:8000/api/users/suggested-friends", { withCredentials: true })
            .then(response => setSuggestedFriends(response.data))
            .catch(error => console.error("Error fetching suggested friends:", error));

        // Fetch friend requests
        axios.get("http://localhost:8000/api/users/friends", { withCredentials: true })
            .then(response => console.log(response.data))
            .catch(error => console.error("Error fetching friends and friend requests:", error));

    }, []);

    const handleSearch = async (query) => {
        if (!(query.username?.trim() || query.college?.trim() || query.branch?.trim())) {
            console.error("Error: At least one search parameter is required.");
            return;
        }

        setLoading(true);
        try {
            const params = {};
            if (query.username?.trim()) params.username = query.username.trim();
            if (query.college?.trim()) params.college = query.college.trim();
            if (query.branch?.trim()) params.branch = query.branch.trim();

            const response = await axios.get("http://localhost:8000/api/users/search", {
                params,
                withCredentials: true
            });

            setSearchResults(response.data);

            if (response.data.length > 0 && query.username) {
                const updatedSearches = [{ username: query.username }, ...recentSearches];
                const uniqueSearches = Array.from(new Map(updatedSearches.map(user => [user.username, user])).values());
                localStorage.setItem("recentSearches", JSON.stringify(uniqueSearches.slice(0, 5)));
                setRecentSearches(uniqueSearches);
            }
        } catch (error) {
            console.error("Error fetching search results:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const acceptRequest = async (senderId) => {
        try {
            await axios.post(`http://localhost:8000/api/accept-request/${senderId}`, {}, { withCredentials: true });
            setFriendRequests(prev => prev.filter(req => req._id !== senderId));
        } catch (err) {
            console.error("Error accepting request:", err.response?.data || err.message);
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 mt-32 flex flex-col backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg rounded-2xl p-6 md:p-8 max-w-4xl w-full"
            >
                <div className="bg-white/20 p-4 rounded-lg shadow-md mb-6 backdrop-blur-lg">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {loading ? (
                    <div className="text-center text-xl">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RecentSearches recentSearches={recentSearches} />
                        <UserList title="Search Results" users={searchResults} />
                        <div className="md:col-span-2">
                            <UserList title="Suggested Friends" users={suggestedFriends} />
                        </div>
                    </div>
                )}

                {/* Friends List */}
                <FriendsList />

                {/* Friend Requests Section */}
                <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-3">Pending Friend Requests</h2>
                    {friendRequests.length === 0 ? (
                        <p className="text-gray-400">No pending requests.</p>
                    ) : (
                        friendRequests.map((user) => (
                            <div key={user._id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg mb-2">
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

                {/* Styled Button */}
                <button className="mt-6 px-6 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition">
                    Back to Dashboard
                </button>
            </motion.div>
        </section>
    );
};

export default SearchUser;
