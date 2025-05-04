import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaUser, FaUniversity, FaCodeBranch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
 
    const [username, setUsername] = useState("");
    const [college, setCollege] = useState("");
    const [branch, setBranch] = useState("");
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/auth/colleges`)
            .then(response => setColleges(response.data))
            .catch(error => console.error("Error fetching colleges:", error));

        axios.get(`${BASE_URL}/api/auth/branches`)
            .then(response => setBranches(response.data))
            .catch(error => console.error("Error fetching branches:", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ username, college, branch });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            {/* Username Input */}
            <div className="flex items-center bg-gray-700 p-3 rounded-md flex-1">
                <FaUser className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search by username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent text-white outline-none w-full placeholder-gray-400"
                />
            </div>

            {/* College Dropdown */}
            <div className="flex items-center bg-gray-700 p-3 rounded-md flex-1">
                <FaUniversity className="text-gray-400 mr-2" />
                <select value={college} onChange={(e) => setCollege(e.target.value)} className="bg-transparent text-white outline-none w-full">
                    <option value="">Filter by College</option>
                    {colleges.map((col, index) => (
                        <option key={index} value={col.name}>{col.name}</option>
                    ))}
                </select>
            </div>

            {/* Branch Dropdown */}
            <div className="flex items-center bg-gray-700 p-3 rounded-md flex-1">
                <FaCodeBranch className="text-gray-400 mr-2" />
                <select value={branch} onChange={(e) => setBranch(e.target.value)} className="bg-transparent text-white outline-none w-full">
                    <option value="">Filter by Branch</option>
                    {branches.map((br, index) => (
                        <option key={index} value={br}>{br}</option>
                    ))}
                </select>
            </div>

            {/* Search Button */}
            <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-md flex items-center transition-all hover:bg-blue-600">
                <FaSearch className="mr-2" /> Search
            </button>
        </form>
    );
};

export default SearchBar;
