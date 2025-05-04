import { useEffect, useState } from "react";
import UserCard from "../search/UserCard";

const RecentSearches = ({ recentSearches }) => {
    const [storedSearches, setStoredSearches] = useState([]);

    // Load recent searches from localStorage on component mount
    useEffect(() => {
        const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        setStoredSearches(savedSearches);
    }, []);

    // Update localStorage when recentSearches changes
    useEffect(() => {
        if (recentSearches.length > 0) {
            const updatedSearches = [...recentSearches].slice(0, 5); // Limit to 5 searches
            localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
            setStoredSearches(updatedSearches);
        }
    }, [recentSearches]);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-3">Recent Searches</h2>
            {storedSearches.length === 0 ? (
                <p className="text-gray-400">No recent searches.</p>
            ) : (
                <div className="space-y-2">
                    {storedSearches.map((user, index) => (
                        <UserCard key={index} user={user} onlyUsername={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentSearches;
